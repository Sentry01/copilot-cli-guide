import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Use esbuild for faster builds (default minifier)
    minify: 'esbuild',
    // Optimize chunk splitting
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunk for React and React DOM
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Separate markdown/syntax highlighting (used in LessonView)
          'markdown': ['react-markdown', 'remark-gfm', 'react-syntax-highlighter'],
        },
      },
    },
    // Chunk size warning limit
    chunkSizeWarningLimit: 600,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
  },
})
