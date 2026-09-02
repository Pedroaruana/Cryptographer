import { expect, test } from '@playwright/test'
import { abrir } from './ajuda'

const SITE = 'https://cryptographer-seven.vercel.app'

const TELAS = [
  { rota: '/', titulo: /^Cryptographer, criptografia/ },
  { rota: '/encrypt', titulo: /^Criptografar arquivo com senha \| Cryptographer$/ },
  { rota: '/decrypt', titulo: /^Descriptografar arquivo \.cgph \| Cryptographer$/ },
  { rota: '/esconder', titulo: /^Esconder senha dentro de foto ou áudio \| Cryptographer$/ },
  { rota: '/metadados', titulo: /metadados EXIF da foto \| Cryptographer$/ },
  { rota: '/hash', titulo: /^Calcular o hash SHA-256 de um arquivo \| Cryptographer$/ },
  { rota: '/simuladores', titulo: /^Simuladores de cifras clássicas \| Cryptographer$/ },
  { rota: '/privacy', titulo: /^Política de privacidade \| Cryptographer$/ },
  { rota: '/terms', titulo: /^Termos de uso \| Cryptographer$/ },
  { rota: '/cookies', titulo: /^Cookies \| Cryptographer$/ }
]

const ler = (page: import('@playwright/test').Page, seletor: string, campo = 'content') =>
  page.locator(seletor).getAttribute(campo)

// isso ja esteve errado: as dez rotas serviam o mesmo canonical apontando pra
// home, o que pede pro buscador tirar as outras nove do indice
test('cada tela tem o proprio titulo, descricao e endereco oficial', async ({ page }) => {
  const vistos = new Set<string>()

  for (const tela of TELAS) {
    await abrir(page, tela.rota)

    await expect(page).toHaveTitle(tela.titulo)

    const canonical = await ler(page, 'link[rel=canonical]', 'href')
    expect(canonical, `canonical de ${tela.rota}`).toBe(`${SITE}${tela.rota}`)

    const descricao = (await ler(page, 'meta[name=description]')) ?? ''
    expect(descricao.length, `descricao de ${tela.rota}`).toBeGreaterThan(60)

    expect(await ler(page, 'meta[property="og:title"]')).toBe(await page.title())
    expect(await ler(page, 'meta[property="og:url"]')).toBe(canonical)

    vistos.add(`${await page.title()}|${descricao}`)
  }

  // dez telas, dez cabecalhos diferentes
  expect(vistos.size).toBe(TELAS.length)
})

test('a home carrega a ficha do site e as outras telas nao', async ({ page }) => {
  await abrir(page, '/')

  const ficha = JSON.parse((await page.locator('script#dados-estruturados').textContent()) ?? '{}')

  expect(ficha['@type']).toBe('WebApplication')
  expect(ficha.url).toBe(`${SITE}/`)
  expect(ficha.featureList.length).toBeGreaterThan(3)

  await abrir(page, '/hash')
  await expect(page.locator('script#dados-estruturados')).toHaveCount(0)
})

test('endereco que nao existe fica fora do indice', async ({ page }) => {
  await abrir(page, '/isso-nao-existe')

  await expect(page).toHaveTitle(/Página não encontrada/)
  expect(await ler(page, 'meta[name=robots]')).toBe('noindex')

  await abrir(page, '/hash')
  await expect(page.locator('meta[name=robots]')).toHaveCount(0)
})

test('o cabecalho acompanha a troca de idioma', async ({ page }) => {
  await abrir(page, '/esconder')

  await expect(page).toHaveTitle(/^Esconder senha dentro de foto/)

  await page.getByRole('button', { name: 'EN', exact: true }).click()

  await expect(page).toHaveTitle(/^Hide a password inside a photo/)
  expect(await ler(page, 'meta[property="og:locale"]')).toBe('en_US')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})
