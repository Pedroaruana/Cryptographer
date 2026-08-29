import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // o nucleo de cripto usa Web Crypto, Blob e TextEncoder, que o Node
    // moderno ja tem. nao precisa de navegador de mentira aqui
    environment: 'node',
    include: ['src/**/*.test.ts']
  }
})
