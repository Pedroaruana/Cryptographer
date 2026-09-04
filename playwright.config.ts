import { defineConfig, devices } from '@playwright/test'

const PORT = 4173
const baseURL = `http://localhost:${PORT}`

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  // no CI vale os dois: o github anota a linha que quebrou direto no diff,
  // e o html vira anexo pra abrir e ver o passo a passo
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : 'list',

  use: {
    baseURL,
    // o site escolhe o idioma pelo navegador na primeira visita. fixo em
    // portugues pra os testes procurarem sempre os mesmos textos
    locale: 'pt-BR',
    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'desktop',
      // 1440 e nao os 1280 que vem por padrao: o menu completo do topo so
      // aparece a partir de 1400, e abaixo disso vale a gaveta, que ja e
      // testada no projeto do celular
      use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 900 } },
      testIgnore: /celular\.spec\.ts/
    },
    { name: 'celular', use: { ...devices['Pixel 7'] }, testMatch: /celular\.spec\.ts/ }
  ],

  // roda contra o build, nao contra o servidor de desenvolvimento: e o mesmo
  // codigo que vai pro ar, com os pedacos carregados sob demanda de verdade
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000
  }
})
