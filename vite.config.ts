import { defineConfig } from 'vitest/config';
import { cloudflare } from "@cloudflare/vite-plugin";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'
import { resolve } from 'path';


export default defineConfig({
  plugins: [
    cloudflare(),
    react(),
    tailwindcss(),
    VitePWA({
      registerType: "autoUpdate",
      manifest: {
        name: "Poker Chip Calculator",
        short_name: "Chip Calc",
        description: "ポーカーチップスタック計算機",
        theme_color: "#09090b",
        background_color: "#09090b",
        display: "standalone",
        scope: "/",
        start_url: "/",
        icons: [
          { src: "pwa-192x192.svg", sizes: "192x192", type: "image/svg+xml" },
          { src: "pwa-512x512.svg", sizes: "512x512", type: "image/svg+xml" },
        ],
      },
    }),
  ],
  server: {
    watch: {
      ignored: ["**/openspec/**", "**/.claude/worktrees/**"],
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
    exclude: ["node_modules", ".claude/worktrees/**"],
    coverage: {
      include: ["src/lib/**", "src/components/**"],
      exclude: ["src/components/ui/**", "src/components/UnitInput.tsx"],
    },
  },
})