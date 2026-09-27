import type { Metadata, Viewport } from "next";
import { Kaisei_Opti, Noto_Sans } from "next/font/google";
import { sitio } from "@/lib/sitio";
import "./globals.css";

const kaisei = Kaisei_Opti({
  variable: "--font-kaisei",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const noto = Noto_Sans({
  variable: "--font-noto",
  weight: ["400", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(sitio.url),
  title: sitio.titulo,
  description: sitio.descripcion,
  applicationName: sitio.nombre,
  authors: [{ name: sitio.nombre }],
  creator: sitio.nombre,
  keywords: [
    "consultoría comercial",
    "coaching de ventas",
    "coaching ejecutivo",
    "capacitación de equipos de venta",
    "liderazgo comercial",
    "call centers",
    "procesos comerciales",
    "Marlene Batta",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: sitio.nombre,
    title: sitio.titulo,
    description: sitio.descripcion,
    locale: sitio.locale,
  },
  twitter: {
    card: "summary_large_image",
    title: sitio.titulo,
    description: sitio.descripcion,
  },
  robots: sitio.indexable
    ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } }
    : { index: false, follow: false },
  formatDetection: { telephone: false, email: false, address: false },
};

export const viewport: Viewport = {
  themeColor: "#005188",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${kaisei.variable} ${noto.variable} antialiased`}>
      <body className="bg-white font-sans text-tinta">{children}</body>
    </html>
  );
}
