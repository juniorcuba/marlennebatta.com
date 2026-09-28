import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      // "server-only" lanza un error fuera del bundle de servidor de Next; en tests no aplica.
      "server-only": fileURLToPath(new URL("./tests/vacio.ts", import.meta.url)),
    },
  },
  test: { include: ["tests/**/*.test.ts"] },
});
