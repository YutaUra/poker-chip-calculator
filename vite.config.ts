import { defineConfig } from 'vitest/config';
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path';


export default defineConfig({
  plugins: [cloudflare(), react(), tailwindcss()],
  server: {
    watch: {
      ignored: ["**/openspec/**"],
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test-setup.ts"],
    coverage: {
      include: ["src/lib/**", "src/components/**"],
      exclude: ["src/components/ui/**", "src/components/UnitInput.tsx"],
    },
  },
})