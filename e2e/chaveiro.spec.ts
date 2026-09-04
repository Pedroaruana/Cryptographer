import { expect, test, type Page } from '@playwright/test'
import { abrir, baixar } from './ajuda'

const ORIGINAL = Buffer.from('GAVIAO ATACA AS SEIS')

// gera um par e devolve as duas chaves como texto, do jeito que a pessoa
// copiaria da tela
const gerarPar = async (page: Page) => {
  await page.getByRole('button', { name: 'Meu par', exact: true }).click()
  await page.getByRole('button', { name: /Gerar (meu par|outro)/ }).click()

  const chaves = page.locator('textarea[readonly]')

  await expect(chaves.first()).not.toHaveValue('', { timeout: 20_000 })

  return {
    publica: await chaves.nth(0).inputValue(),
    privada: await chaves.nth(1).inputValue()
  }
}

const escolherArquivo = (page: Page, nome: string, bytes: Buffer) =>
  page.locator('input[type=file]').first().setInputFiles({
    name: nome,
    mimeType: 'application/octet-stream',
    buffer: bytes
  })

test('gera um par de chaves que da pra copiar', async ({ page }) => {
  await abrir(page, '/chaveiro')

  const par = await gerarPar(page)

  expect(par.publica).toContain('BEGIN CRYPTOGRAPHER PUBLIC KEY')
  expect(par.privada).toContain('BEGIN CRYPTOGRAPHER PRIVATE KEY')
  expect(par.publica).not.toBe(par.privada)

  // duas visitas nunca dao o mesmo par
  const outro = await gerarPar(page)
  expect(outro.publica).not.toBe(par.publica)
})

test('tranca com a chave publica e so a privada certa abre', async ({ page }) => {
  await abrir(page, '/chaveiro')

  const ana = await gerarPar(page)
  const bruno = await gerarPar(page)

  await page.getByRole('button', { name: 'Trancar pra alguém' }).click()
  await escolherArquivo(page, 'ordem.txt', ORIGINAL)
  await page.getByLabel('Chave pública de quem vai receber').fill(ana.publica)
  await page.getByRole('button', { name: 'Trancar pra essa pessoa' }).click()

  await expect(page.getByText('Trancado. Só ela abre.')).toBeVisible({ timeout: 30_000 })

  const trancado = await baixar(page, /Baixar arquivo trancado/)

  expect(trancado.nome).toMatch(/\.cgpk$/)
  expect(trancado.bytes.includes(ORIGINAL)).toBe(false)
  expect(trancado.bytes.subarray(0, 4).toString()).toBe('CGPK')

  // a chave errada e recusada
  await abrir(page, '/chaveiro')
  await page.getByRole('button', { name: 'Trancar pra alguém' }).click()
  await page.getByRole('button', { name: 'Abrir o que mandaram' }).click()
  await escolherArquivo(page, trancado.nome, trancado.bytes)
  await page.getByLabel('Sua chave privada').fill(bruno.privada)
  await page.getByRole('button', { name: 'Abrir com a minha chave' }).click()

  await expect(page.getByText(/não foi trancado pra essa chave/)).toBeVisible({ timeout: 30_000 })

  // a certa abre e devolve o original inteiro
  await page.getByLabel('Sua chave privada').fill(ana.privada)
  await page.getByRole('button', { name: 'Abrir com a minha chave' }).click()

  await expect(page.getByText('Aberto.', { exact: true })).toBeVisible({ timeout: 30_000 })

  const devolvido = await baixar(page, /Baixar o original/)

  expect(devolvido.nome).toBe('ordem.txt')
  expect(devolvido.bytes.equals(ORIGINAL)).toBe(true)
})

test('reparte um segredo e remonta com o minimo de partes', async ({ page }) => {
  const segredo = 'a senha do cofre e 4417'

  await abrir(page, '/chaveiro')
  await page.getByRole('button', { name: 'Repartir um segredo' }).click()

  await page.getByLabel('O segredo').fill(segredo)
  await page.getByRole('button', { name: 'Repartir', exact: true }).click()

  await expect(page.getByText('Repartido em 5 partes.')).toBeVisible()

  const partes = await page.locator('textarea[readonly]').allInnerTexts()
  const valores = await page.locator('textarea[readonly]').evaluateAll((areas) =>
    areas.map((area) => (area as HTMLTextAreaElement).value)
  )

  expect(partes).toHaveLength(5)
  for (const parte of valores) expect(parte).not.toContain(segredo)

  const colar = page.getByPlaceholder('cole aqui as partes')

  await colar.fill([valores[0], valores[2], valores[4]].join('\n\n'))
  await page.getByRole('button', { name: 'Remontar o segredo' }).click()

  const remontado = page.locator('p.sheet-soft.font-mono')

  await expect(page.getByText('Remontado.')).toBeVisible()
  await expect(remontado).toHaveText(segredo)

  // com uma parte a menos a conta ainda roda, mas devolve ruido. e por isso
  // que a tela avisa que faltar parte nao da erro, da resposta errada
  await colar.fill([valores[0], valores[1]].join('\n\n'))
  await page.getByRole('button', { name: 'Remontar o segredo' }).click()

  await expect(remontado).not.toHaveText(segredo)
})

test('assina um arquivo e confere com a chave publica', async ({ page }) => {
  await abrir(page, '/chaveiro')

  const ana = await gerarPar(page)
  const bruno = await gerarPar(page)

  await abrir(page, '/hash')
  await page.getByRole('button', { name: 'Assinar', exact: true }).first().click()

  await escolherArquivo(page, 'contrato.txt', Buffer.from('pago 100 reais'))
  await page.getByLabel('Sua chave privada').fill(ana.privada)
  await page.getByRole('button', { name: 'Assinar o arquivo' }).click()

  const assinatura = page.locator('.sheet-soft p.font-mono').first()
  await expect(assinatura).toContainText('BEGIN CRYPTOGRAPHER SIGNATURE', { timeout: 30_000 })

  const texto = await assinatura.innerText()

  await page.getByRole('button', { name: 'Conferir', exact: true }).click()
  await escolherArquivo(page, 'contrato.txt', Buffer.from('pago 100 reais'))
  await page.getByLabel('Chave pública de quem assinou').fill(ana.publica)
  await page.getByLabel('A assinatura').fill(texto)
  await page.getByRole('button', { name: 'Conferir a assinatura' }).click()

  await expect(page.getByText(/Confere\. Foi essa pessoa/)).toBeVisible({ timeout: 30_000 })

  // chave de outra pessoa nao confere
  await page.getByLabel('Chave pública de quem assinou').fill(bruno.publica)
  await page.getByRole('button', { name: 'Conferir a assinatura' }).click()

  await expect(page.getByText(/Não confere/)).toBeVisible({ timeout: 30_000 })
})

test('sela com senha e recusa quando o arquivo muda', async ({ page }) => {
  await abrir(page, '/hash')
  await page.getByRole('button', { name: 'Selo com senha' }).click()

  await escolherArquivo(page, 'relatorio.txt', Buffer.from('pago 100 reais'))
  await page.getByLabel('Senha', { exact: true }).fill('combinado')
  await page.getByRole('button', { name: 'Selar o arquivo' }).click()

  const selo = page.locator('.sheet-soft p.font-mono').first()
  await expect(selo).not.toHaveText('...', { timeout: 30_000 })

  const marca = await selo.innerText()

  await page.getByRole('button', { name: 'Conferir', exact: true }).click()
  await escolherArquivo(page, 'relatorio.txt', Buffer.from('pago 900 reais'))
  await page.getByLabel('Senha', { exact: true }).fill('combinado')
  await page.getByLabel('O selo que veio junto').fill(marca)
  await page.getByRole('button', { name: 'Conferir o selo' }).click()

  await expect(page.getByText(/Não confere/)).toBeVisible({ timeout: 30_000 })
})

test('as duas bancadas novas aparecem e reagem', async ({ page }) => {
  await abrir(page, '/simuladores')

  // troca de chaves: os dois lados tem que cair no mesmo numero
  await expect(page.getByText(/os dois chegaram no mesmo número/)).toBeVisible()

  const seletores = page.locator('input[type=range]')
  await seletores.first().fill('11')

  await expect(page.getByText(/os dois chegaram no mesmo número/)).toBeVisible()

  // modos: o GCM recusa o arquivo adulterado, o CBC nao
  await expect(page.getByText('percebeu e recusou')).toBeVisible()
  await expect(page.getByText('aceitou calado e entregou outra coisa')).toBeVisible()
})
