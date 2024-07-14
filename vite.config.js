import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base:"/customer-and-transaction",
  server: {
    fs: {
      strict: false
    }
  },
  plugins: [react()],
})
