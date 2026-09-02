import { expect, test } from '@playwright/test'
import { abrir, baixar } from './ajuda'

const SENHA = 'canivete-suico-42'
const ORIGINAL = Buffer.from('o pin do cofre e 4417, nao conta pra ninguem')

const escolherArquivo = (page: import('@playwright/test').Page, nome: string, bytes: Buffer) =>
  page.locator('input[type=file]').setInputFiles({
    name: nome,
    mimeType: 'application/octet-stream',
    buffer: bytes
  })

const digitarSenha = async (page: import('@playwright/test').Page, senha: string) => {
  await page.getByLabel('Senha', { exact: true }).fill(senha)

  const confirmar = page.getByLabel('Digita de novo')
  if (await confirmar.count()) await confirmar.fill(senha)
}

test('lacra um arquivo e abre de volta byte por byte igual', async ({ page }) => {
  await abrir(page, '/encrypt')

  await escolherArquivo(page, 'segredo.txt', ORIGINAL)
  await digitarSenha(page, SENHA)
  await page.getByRole('button', { name: 'Lacrar', exact: true }).click()

  await expect(page.getByText('Lacrado e pronto.')).toBeVisible({ timeout: 30_000 })

  const lacrado = await baixar(page, /Baixar arquivo lacrado/)

  expect(lacrado.nome).toMatch(/\.cgph$/)
  // o arquivo lacrado nao pode ter o conteudo original a vista dentro dele
  expect(lacrado.bytes.includes(ORIGINAL)).toBe(false)
  expect(lacrado.bytes.subarray(0, 4).toString()).toBe('CGPH')

  await abrir(page, '/decrypt')

  await escolherArquivo(page, lacrado.nome, lacrado.bytes)
  await digitarSenha(page, SENHA)
  await page.getByRole('button', { name: 'Abrir', exact: true }).click()

  await expect(page.getByText('Aberto. Tá aqui.')).toBeVisible({ timeout: 30_000 })

  const devolvido = await baixar(page, /Baixar o original/)

  expect(devolvido.nome).toBe('segredo.txt')
  expect(devolvido.bytes.equals(ORIGINAL)).toBe(true)
})

test('recusa a senha errada', async ({ page }) => {
  await abrir(page, '/encrypt')

  await escolherArquivo(page, 'segredo.txt', ORIGINAL)
  await digitarSenha(page, SENHA)
  await page.getByRole('button', { name: 'Lacrar', exact: true }).click()
  await expect(page.getByText('Lacrado e pronto.')).toBeVisible({ timeout: 30_000 })

  const lacrado = await baixar(page, /Baixar arquivo lacrado/)

  await abrir(page, '/decrypt')

  await escolherArquivo(page, lacrado.nome, lacrado.bytes)
  await digitarSenha(page, 'essa-nao-e-a-senha')
  await page.getByRole('button', { name: 'Abrir', exact: true }).click()

  await expect(page.getByText('Essa senha não abre esse arquivo.')).toBeVisible({
    timeout: 30_000
  })
  await expect(page.getByRole('link', { name: /Baixar o original/ })).toHaveCount(0)
})

// esse ja quebrou uma vez: trocar o formato de saida jogava fora o arquivo
// escolhido e o botao ficava cinza sem explicar por que
test('trocar entre cgph e zip nao perde o arquivo escolhido', async ({ page }) => {
  await abrir(page, '/encrypt')

  // o nome aparece na area de soltar e tambem no desenho do papel ao lado,
  // entao procuro so dentro da area de soltar
  const escolhido = page.locator('.dropzone').getByText('foto.png')

  await escolherArquivo(page, 'foto.png', Buffer.alloc(2048, 7))
  await expect(escolhido).toBeVisible()

  await page.getByRole('button', { name: /arquivo \.zip/ }).click()
  await expect(escolhido).toBeVisible()

  await page.getByRole('button', { name: /arquivo \.cgph/ }).click()
  await expect(escolhido).toBeVisible()
})

test('o botao apagado diz o que esta faltando', async ({ page }) => {
  await abrir(page, '/encrypt')

  const lacrar = page.getByRole('button', { name: 'Lacrar', exact: true })

  await expect(lacrar).toBeDisabled()
  await expect(page.getByText('Falta escolher o arquivo.')).toBeVisible()

  await escolherArquivo(page, 'segredo.txt', ORIGINAL)
  await expect(page.getByText('Falta a senha.')).toBeVisible()

  await digitarSenha(page, SENHA)
  await expect(lacrar).toBeEnabled()
})

test('lacra uma mensagem e abre de volta', async ({ page }) => {
  const recado = 'encontro as 19h no mesmo lugar'

  await abrir(page, '/encrypt')

  await page.getByRole('button', { name: 'Mensagem', exact: true }).click()
  await page.getByPlaceholder('Escreve o segredo que você quer esconder...').fill(recado)
  await digitarSenha(page, SENHA)
  await page.getByRole('button', { name: 'Lacrar', exact: true }).click()

  await expect(page.getByText('Lacrado e pronto.')).toBeVisible({ timeout: 30_000 })

  const lacrada = await page.locator('textarea[readonly]').inputValue()

  expect(lacrada).toContain('CRYPTOGRAPHER')
  expect(lacrada).not.toContain(recado)

  await abrir(page, '/decrypt')

  await page.getByRole('button', { name: 'Mensagem', exact: true }).click()
  await page.getByPlaceholder('Cola aqui a mensagem lacrada...').fill(lacrada)
  await digitarSenha(page, SENHA)
  await page.getByRole('button', { name: 'Abrir', exact: true }).click()

  await expect(page.getByText('Aberto. Tá aqui.')).toBeVisible({ timeout: 30_000 })
  await expect(page.locator('textarea[readonly]')).toHaveValue(recado)
})
