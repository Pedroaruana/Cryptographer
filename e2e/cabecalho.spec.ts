import { expect, test } from '@playwright/test'
import { abrir } from './ajuda'

const SITE = 'https://cryptographer-seven.vercel.app'

const TELAS = [
  { rota: '/', titulo: /^Cryptographer, criptografia/, marca: 'como se tranca' },
  {
    rota: '/encrypt',
    titulo: /^Criptografar arquivo com senha \| Cryptographer$/,
    marca: 'Tranca isso.'
  },
  {
    rota: '/decrypt',
    titulo: /^Descriptografar arquivo \.cgph \| Cryptographer$/,
    marca: 'Quebra o lacre.'
  },
  {
    rota: '/esconder',
    titulo: /^Esconder senha dentro de foto ou áudio \| Cryptographer$/,
    marca: 'segredo dentro de uma foto'
  },
  {
    rota: '/metadados',
    titulo: /metadados EXIF da foto \| Cryptographer$/,
    marca: 'Metadados'
  },
  {
    rota: '/hash',
    titulo: /^Calcular o hash SHA-256 de um arquivo \| Cryptographer$/,
    marca: 'Prove que nada mudou.'
  },
  {
    rota: '/simuladores',
    titulo: /^Simuladores de cifras clássicas \| Cryptographer$/,
    marca: 'César'
  },
  {
    rota: '/privacy',
    titulo: /^Política de privacidade \| Cryptographer$/,
    marca: 'Privacidade'
  },
  { rota: '/terms', titulo: /^Termos de uso \| Cryptographer$/, marca: 'Termos' },
  { rota: '/cookies', titulo: /^Cookies \| Cryptographer$/, marca: 'Cookies' }
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

// o robo que nao roda javascript so ve isso. antes ele recebia uma div vazia
test('o html que sai do servidor ja vem com a tela desenhada', async ({ request }) => {
  for (const tela of TELAS) {
    const html = await (await request.get(tela.rota)).text()

    expect(html, `${tela.rota} veio com a div vazia`).not.toContain('<div id="root"></div>')
    expect(html.match(/<title>([^<]*)<\/title>/)?.[1], `titulo de ${tela.rota}`).toMatch(
      tela.titulo
    )
    expect(html, `canonical de ${tela.rota}`).toContain(
      `rel="canonical" href="${SITE}${tela.rota}"`
    )
    expect(html, `texto de ${tela.rota}`).toContain(tela.marca)
  }
})

test('o html estatico nao trava o tema no claro', async ({ request }) => {
  const html = await (await request.get('/')).text()

  // se o data-theme viesse escrito no arquivo, quem usa o tema escuro veria
  // um piscar branco antes do javascript subir
  expect(html).not.toContain('data-theme')
})

// sem isso o link no whatsapp e no linkedin aparece sem figura nenhuma
test('o link compartilhado leva uma imagem junto', async ({ request, page }) => {
  const html = await (await request.get('/encrypt')).text()

  expect(html).toContain(`content="${SITE}/og.png"`)
  expect(html).toContain('content="summary_large_image"')

  const imagem = await request.get('/og.png')

  expect(imagem.ok()).toBe(true)
  expect(imagem.headers()['content-type']).toBe('image/png')

  await abrir(page, '/hash')
  expect(await ler(page, 'meta[property="og:image"]')).toBe(`${SITE}/og.png`)
})
