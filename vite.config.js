import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // Distinct from the TypeScript version's default 5173, so both can run
    // side by side during the JS/TS comparison.
    port: 5174,
  },
  test: {
    environment: 'jsdom',
    // jsdom's Storage APIs (localStorage) require a real http(s) origin —
    // without this it defaults to "about:blank" and localStorage is undefined.
    environmentOptions: {
      jsdom: { url: 'http://localhost:3000' },
    },
    globals: true,
    setupFiles: './src/test/setup.js',
  },
})