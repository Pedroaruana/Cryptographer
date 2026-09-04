import { describe, expect, it } from 'vitest'
import { conferirSelo, selar } from '../hmac'

const noop = () => {}

describe('selo com senha', () => {
  it('confere com a mesma senha', async () => {
    const arquivo = new Blob(['relatorio de agosto'])
    const selo = await selar(arquivo, 'combinado', noop)

    expect(await conferirSelo(arquivo, 'combinado', selo, noop)).toBe(true)
  })

  it('nao confere com senha errada', async () => {
    const arquivo = new Blob(['relatorio de agosto'])
    const selo = await selar(arquivo, 'combinado', noop)

    expect(await conferirSelo(arquivo, 'outra', selo, noop)).toBe(false)
  })

  it('nao confere se o arquivo mudou', async () => {
    const selo = await selar(new Blob(['pago 100 reais']), 'combinado', noop)

    expect(await conferirSelo(new Blob(['pago 900 reais']), 'combinado', selo, noop)).toBe(false)
  })

  // o sal muda a cada selo, entao o texto muda, mas os dois conferem
  it('o mesmo arquivo com a mesma senha da selos diferentes, e os dois valem', async () => {
    const arquivo = new Blob(['igual'])

    const um = await selar(arquivo, 'senha', noop)
    const dois = await selar(arquivo, 'senha', noop)

    expect(um).not.toBe(dois)
    expect(await conferirSelo(arquivo, 'senha', um, noop)).toBe(true)
    expect(await conferirSelo(arquivo, 'senha', dois, noop)).toBe(true)
  })

  it('nao quebra com selo estragado', async () => {
    expect(await conferirSelo(new Blob(['x']), 'senha', 'isso nao e um selo', noop)).toBe(false)
    expect(await conferirSelo(new Blob(['x']), 'senha', '', noop)).toBe(false)
  })
})
