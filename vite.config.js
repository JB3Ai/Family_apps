import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      manifest: {
        name: 'Family Sync',
        short_name: 'FamilySync',
        description: 'Family Schedule & Coordination App',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'app-icon.jpg',
            sizes: '1024x1024',
            type: 'image/jpeg',
            purpose: 'any maskable'
          },
          {
            src: 'app-icon.jpg',
            sizes: '512x512',
            type: 'image/jpeg'
          },
          {
            src: 'app-icon.jpg',
            sizes: '192x192',
            type: 'image/jpeg'
          }
        ]
      }
    })
  ],
  server: {
    port: 3000,
  },
})
