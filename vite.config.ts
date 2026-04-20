import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [
      react(), 
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'VenomSnake Detector',
          short_name: 'VenomSnake',
          description: 'High-speed snake species identification for rural safety.',
          theme_color: '#0a0a0a',
          background_color: '#0a0a0a',
          icons: [
            {
              src: 'https://picsum.photos/seed/snake-icon/192/192',
              sizes: '192x192',
              type: 'image/png'
            },
            {
              src: 'https://picsum.photos/seed/snake-icon/512/512',
              sizes: '512x512',
              type: 'image/png'
            }
          ]
        },
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        }
      })
    ],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || process.env.GEMINI_API_KEY || ""),
    },
    build: {
      chunkSizeWarningLimit: 2000,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-three': ['three', '@react-three/fiber', '@react-three/drei'],
            'vendor-ui': ['lucide-react', 'motion', 'react', 'react-dom'],
          }
        }
      }
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
