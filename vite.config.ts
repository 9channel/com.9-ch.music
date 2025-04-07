import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      manifestFilename: 'manifest.json',
      manifest: {
        name: '9Channel Music Tools',
        short_name: 'Music Tools',
        description: '9Channel Music Tools',
        start_url: '/',
        display: 'fullscreen',
        icons: [
          {
            src: '/favicon.ico',
            sizes: '512x512',
            type: 'image/x-icon',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
