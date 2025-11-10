import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import tailwindcss from "@tailwindcss/vite";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    // Aumenta o limite do warning, mas o ideal é resolver o problema
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Chunking manual para separar dependências grandes
        manualChunks: {
          // React e dependências core
          'react-vendor': ['react', 'react-dom'],
          
          // GSAP (provavelmente uma das maiores dependências)
          'gsap-vendor': ['gsap'],
          
          // Outras bibliotecas de UI/Animação se existirem
          'ui-vendor': [
            // Adicione aqui outras libs de UI que você usa
            // Exemplo: 'framer-motion', 'lottie-react', etc.
          ],
          
          // Utilitários
          'utils-vendor': [
            // Adicione libs utilitárias aqui
            // Exemplo: 'lodash', 'date-fns', 'axios', etc.
          ]
        },
        
        // Estratégia alternativa: chunking por tamanho e tipo
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
          
          if (facadeModuleId) {
            if (facadeModuleId.includes('node_modules')) {
              return 'vendor/[name]-[hash].js'
            }
            if (facadeModuleId.includes('components')) {
              return 'components/[name]-[hash].js'
            }
            if (facadeModuleId.includes('pages')) {
              return 'pages/[name]-[hash].js'
            }
          }
          
          return 'chunks/[name]-[hash].js'
        }
      }
    }
  },
  
  // Otimizações adicionais
  esbuild: {
    // Remove console.logs e debuggers em produção
    drop: ['console', 'debugger'],
  },
  
  // Pre-bundling de dependências
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'gsap',
      '',
      '', 
      // Adicione outras dependências grandes que devem ser pre-bundled
    ],
    exclude: [
      // Exclua dependências que causam problemas no pre-bundling
    ]
  }
})