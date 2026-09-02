import { expect, test } from '@playwright/test'
import { abrir } from './ajuda'

test('o menu do celular abre e leva pra tela escolhida', async ({ page }) => {
  await abrir(page, '/')

  const menu = page.getByRole('button', { name: 'Menu' })

  await expect(menu).toBeVisible()
  await expect(menu).toHaveAttribute('aria-expanded', 'false')

  await menu.click()
  await expect(menu).toHaveAttribute('aria-expanded', 'true')

  await page.getByRole('link', { name: 'Impressão digital' }).click()

  await expect(page).toHaveURL(/\/hash$/)
  await expect(page.getByRole('heading', { name: 'Prove que nada mudou.' })).toBeVisible()
  // trocou de tela, o painel tem que fechar sozinho
  await expect(menu).toHaveAttribute('aria-expanded', 'false')
})

test('nenhuma tela rola pra o lado no celular', async ({ page }) => {
  const telas = ['/', '/encrypt', '/decrypt', '/esconder', '/metadados', '/hash', '/simuladores']

  for (const tela of telas) {
    await abrir(page, tela)

    const sobra = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    )

    expect(sobra, `a tela ${tela} esta mais larga que o celular`).toBeLessThanOrEqual(0)
  }
})
