# syntax=docker/dockerfile:1

# Next.js 16 en modo standalone. Node 22.13+ (el proyecto avisa de EBADENGINE
# con 22.11) sobre alpine para que la imagen final quede pequeña.
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:22-alpine AS builder
WORKDIR /app
# Las NEXT_PUBLIC_* se hornean en el bundle durante el build; en runtime ya no
# se leen. Si no llegan hasta aqui, no existen en la pagina servida, por mucho
# que esten declaradas en render.yaml.
# Por defecto "true": un despliegue que olvide pasarla queda SIN indexar. Es el
# fallo seguro para el sitio de una clienta real servido desde una URL
# provisional. Para publicar de verdad hay que ponerla a "false" a proposito.
ARG NEXT_PUBLIC_NOINDEX="true"
ENV NEXT_PUBLIC_NOINDEX=$NEXT_PUBLIC_NOINDEX
# Vacia = se usa site.url. En un preview conviene la URL real del servicio, para
# que el canonical y las etiquetas OG no apunten al dominio de produccion.
ARG NEXT_PUBLIC_SITE_URL=""
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
ENV PORT=3000 HOSTNAME=0.0.0.0
CMD ["node", "server.js"]
