import { expect, test } from '@playwright/test'
import { abrir, esperarReact } from './ajuda'

// o site promete "funciona offline" logo na home. esse teste existe pra essa
// frase nao poder virar mentira sem alguem perceber
test('abre com a rede desligada, e navega entre as telas', async ({ page, context }) => {
  await abrir(page, '/')

  // espera o service worker assumir o controle da aba
  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, {
    timeout: 20_000
  })

  await context.setOffline(true)
  await page.reload()
  await esperarReact(page)

  await expect(page.getByRole('heading', { level: 1 })).toContainText('Tranque um arquivo')

  await page.getByRole('link', { name: 'Impressão digital', exact: true }).first().click()
  await expect(page).toHaveURL(/\/hash$/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Prove que nada mudou.')

  // entrar direto pelo endereco, sem rede, tambem tem que abrir
  await page.goto('/esconder')
  await esperarReact(page)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('segredo dentro de uma foto')
})

test('o hash continua funcionando sem rede', async ({ page, context }) => {
  await abrir(page, '/hash')

  await page.waitForFunction(() => navigator.serviceWorker.controller !== null, null, {
    timeout: 20_000
  })

  await context.setOffline(true)
  await page.reload()
  await esperarReact(page)

  await page.getByRole('button', { name: 'Texto', exact: true }).click()
  await page.getByPlaceholder('Digita ou cola qualquer coisa...').fill('abc')
  await page.getByRole('button', { name: 'Tirar a impressão' }).click()

  await expect(page.locator('.sheet-soft p.font-mono').first()).toHaveText(
    /^ba7816bf 8f01cfea/,
    { timeout: 20_000 }
  )
})
