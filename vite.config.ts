/// <reference types="vitest/config" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/pace-app/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
  },
})
