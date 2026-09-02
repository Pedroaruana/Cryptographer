import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  worker: { format: 'es' },

  // a pasta e2e e do playwright, que sobe o site de verdade e clica nele.
  // sem isso o vitest tentava rodar esses arquivos junto com os outros
  test: { exclude: ['e2e/**', 'node_modules/**', 'dist/**'] }
})
