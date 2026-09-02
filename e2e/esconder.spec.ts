import { readFileSync } from 'node:fs'
import { createHash } from 'node:crypto'
import { expect, test } from '@playwright/test'
import { abrir, baixar } from './ajuda'

// uso o proprio quadro que ja mora no site como cobaia. e uma imagem de
// verdade, do tamanho de uma foto de verdade
const QUADRO = readFileSync(new URL('../public/monalisa.webp', import.meta.url))
const SEGREDO = 'Senha=62527'

test('esconde um segredo na foto e tira de la depois', async ({ page }) => {
  await abrir(page, '/esconder')

  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'quadro.webp', mimeType: 'image/webp', buffer: QUADRO })

  await page.getByPlaceholder('uma senha, um código, um recado...').fill(SEGREDO)
  await page.getByRole('button', { name: 'Esconder na foto' }).click()

  await expect(page.getByText('Escondido. A foto continua igual.')).toBeVisible({
    timeout: 30_000
  })

  const comSegredo = await baixar(page, /Baixar a foto/)

  expect(comSegredo.bytes.subarray(1, 4).toString()).toBe('PNG')
  // o segredo nao pode aparecer legivel dentro do arquivo
  expect(comSegredo.bytes.includes(Buffer.from(SEGREDO))).toBe(false)

  await abrir(page, '/esconder')

  await page.getByRole('button', { name: 'Tirar de lá' }).click()
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'quadro.png', mimeType: 'image/png', buffer: comSegredo.bytes })

  await page.getByRole('button', { name: 'Tirar o segredo de lá' }).click()

  await expect(page.getByText('Achei.')).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('p.sheet-soft.font-mono')).toHaveText(SEGREDO)
})

test('avisa quando a foto nao carrega segredo nenhum', async ({ page }) => {
  await abrir(page, '/esconder')

  await page.getByRole('button', { name: 'Tirar de lá' }).click()
  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'limpa.webp', mimeType: 'image/webp', buffer: QUADRO })

  await page.getByRole('button', { name: 'Tirar o segredo de lá' }).click()

  await expect(page.getByText(/Não tem nada escondido nessa foto/)).toBeVisible({
    timeout: 30_000
  })
})

// a impressao sai quebrada em blocos de oito na tela, entao junto de volta
const lerImpressao = async (page: import('@playwright/test').Page) => {
  const faixa = page.locator('.sheet-soft p.font-mono').first()

  // enquanto le o arquivo essa mesma faixa mostra a porcentagem, entao
  // espero ate ela virar hexadecimal de verdade
  await expect(faixa).toHaveText(/^[0-9a-f]{8}(?: [0-9a-f]{1,8})+$/, { timeout: 30_000 })

  return (await faixa.innerText()).replace(/\s/g, '')
}

test('a impressao digital bate com o valor conhecido', async ({ page }) => {
  await abrir(page, '/hash')

  await page.getByRole('button', { name: 'Texto', exact: true }).click()
  await page.getByPlaceholder('Digita ou cola qualquer coisa...').fill('abc')
  await page.getByRole('button', { name: 'Tirar a impressão' }).click()

  // vetor de teste oficial do SHA-256
  expect(await lerImpressao(page)).toBe(
    'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
  )
})

test('a impressao de um arquivo bate com a que o node calcula', async ({ page }) => {
  const arquivo = Buffer.from('qualquer coisa aqui dentro')
  const esperado = createHash('sha256').update(arquivo).digest('hex')

  await abrir(page, '/hash')

  await page
    .locator('input[type=file]')
    .setInputFiles({ name: 'coisa.bin', mimeType: 'application/octet-stream', buffer: arquivo })

  await page.getByRole('button', { name: 'Tirar a impressão' }).click()

  expect(await lerImpressao(page)).toBe(esperado)

  await page.getByLabel('Comparar com uma impressão conhecida').fill(esperado)

  await expect(page.getByText('Bateu. O arquivo é exatamente o que você esperava.')).toBeVisible()
})
