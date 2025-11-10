import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true, // Abre o relatório no navegador automaticamente
      filename: "stats.html", // Nome do arquivo de relatório
    }),
  ],
  build: {
    // Aumenta o limite do warning, mas o ideal é resolver o problema
    chunkSizeWarningLimit: 1000,
  },

  // Otimizações adicionais
  esbuild: {
    // Remove console.logs e debuggers em produção
    drop: ["console", "debugger"],
  },

  // Pre-bundling de dependências
  optimizeDeps: {
    include: [
      "react",
      "react-dom",
      "gsap",
    //  "devicons-react",
    //  "",
      // Adicione outras dependências grandes que devem ser pre-bundled
    ],
    exclude: [
      // Exclua dependências que causam problemas no pre-bundling
    ],
  },
});