import { describe, expect, it } from 'vitest'
import { decryptBlob, encryptBlob } from '../core'
import { ALGO_AES_GCM_ARGON2, CryptoError, HEADER_BYTES, MAGIC } from '../format'

const noop = () => {}

// bytes aleatorios de verdade, pra pegar problema de fronteira de bloco que
// texto repetido nao pegaria
const randomBytes = (size: number) => {
  const bytes = new Uint8Array(size)
  for (let i = 0; i < size; i += 65536) {
    crypto.getRandomValues(bytes.subarray(i, Math.min(i + 65536, size)))
  }
  return bytes
}

const meta = (size: number) => ({ name: 'foto.jpg', type: 'image/jpeg', size })

describe('lacrar e abrir arquivo', () => {
  it('devolve o arquivo byte a byte igual', async () => {
    const original = randomBytes(200_000)
    const blob = new Blob([original])

    const sealed = await encryptBlob(blob, meta(blob.size), 'senha boa', noop)
    const opened = await decryptBlob(sealed, 'senha boa', noop)
    const back = new Uint8Array(await opened.blob.arrayBuffer())

    expect(back.length).toBe(original.length)
    expect(Array.from(back)).toEqual(Array.from(original))
  })

  it('guarda nome e tipo originais dentro do lacre', async () => {
    const blob = new Blob([randomBytes(1000)])
    const sealed = await encryptBlob(blob, meta(blob.size), 'x', noop)
    const opened = await decryptBlob(sealed, 'x', noop)

    expect(opened.meta.name).toBe('foto.jpg')
    expect(opened.meta.type).toBe('image/jpeg')
  })

  it('nao deixa o nome original aparecer no arquivo gerado', async () => {
    const blob = new Blob([randomBytes(500)])
    const sealed = await encryptBlob(blob, meta(blob.size), 'x', noop)
    const cru = new TextDecoder('latin1').decode(await sealed.arrayBuffer())

    expect(cru).not.toContain('foto.jpg')
    expect(cru).not.toContain('image/jpeg')
  })

  it('atravessa mais de um bloco de 4 MB', async () => {
    const original = randomBytes(5 * 1024 * 1024)
    const blob = new Blob([original])

    const sealed = await encryptBlob(blob, meta(blob.size), 'senha', noop)
    const opened = await decryptBlob(sealed, 'senha', noop)
    const back = new Uint8Array(await opened.blob.arrayBuffer())

    expect(back.length).toBe(original.length)
    expect(back[0]).toBe(original[0])
    expect(back[back.length - 1]).toBe(original[original.length - 1])
  }, 20_000)

  it('avisa o progresso do comeco ao fim', async () => {
    const marcas: number[] = []
    const blob = new Blob([randomBytes(50_000)])

    await encryptBlob(blob, meta(blob.size), 'x', (valor) => marcas.push(valor))

    expect(marcas.length).toBeGreaterThan(1)
    expect(marcas[marcas.length - 1]).toBeCloseTo(1, 5)
    expect([...marcas].sort((a, b) => a - b)).toEqual(marcas)
  })
})

describe('quando alguma coisa esta errada', () => {
  it('recusa senha errada', async () => {
    const blob = new Blob([randomBytes(1000)])
    const sealed = await encryptBlob(blob, meta(blob.size), 'certa', noop)

    await expect(decryptBlob(sealed, 'errada', noop)).rejects.toMatchObject({
      code: 'wrong-password'
    })
  })

  it('recusa arquivo que nao foi lacrado aqui', async () => {
    const qualquer = new Blob([randomBytes(500)])

    await expect(decryptBlob(qualquer, 'x', noop)).rejects.toMatchObject({
      code: 'not-our-file'
    })
  })

  it('recusa arquivo menor que o cabecalho', async () => {
    await expect(decryptBlob(new Blob([new Uint8Array(10)]), 'x', noop)).rejects.toMatchObject({
      code: 'not-our-file'
    })
  })

  it('recusa versao de formato que nao conhece', async () => {
    const blob = new Blob([randomBytes(300)])
    const sealed = new Uint8Array(
      await (await encryptBlob(blob, meta(blob.size), 'x', noop)).arrayBuffer()
    )

    sealed[4] = 99

    await expect(decryptBlob(new Blob([sealed]), 'x', noop)).rejects.toMatchObject({
      code: 'bad-version'
    })
  })

  // essa e a importante: mexeu num bit, tem que recusar em vez de devolver
  // lixo achando que deu certo
  it('percebe quando mexeram no conteudo', async () => {
    const blob = new Blob([randomBytes(2000)])
    const sealed = new Uint8Array(
      await (await encryptBlob(blob, meta(blob.size), 'x', noop)).arrayBuffer()
    )

    sealed[sealed.length - 20] ^= 0x01

    await expect(decryptBlob(new Blob([sealed]), 'x', noop)).rejects.toBeInstanceOf(CryptoError)
  })

  it('recusa arquivo cortado no meio', async () => {
    const blob = new Blob([randomBytes(2000)])
    const sealed = await encryptBlob(blob, meta(blob.size), 'x', noop)

    await expect(decryptBlob(sealed.slice(0, sealed.size - 40), 'x', noop)).rejects.toBeInstanceOf(
      CryptoError
    )
  })
})

describe('formato do arquivo', () => {
  it('comeca com a assinatura CGPH e a versao 1', async () => {
    const blob = new Blob([randomBytes(100)])
    const sealed = await encryptBlob(blob, meta(blob.size), 'x', noop)
    const head = new Uint8Array(await sealed.slice(0, HEADER_BYTES).arrayBuffer())

    expect(Array.from(head.slice(0, 4))).toEqual(MAGIC)
    expect(head[4]).toBe(1)
  })

  it('a mesma senha nunca gera o mesmo arquivo duas vezes', async () => {
    const blob = new Blob([randomBytes(400)])

    const a = new Uint8Array(await (await encryptBlob(blob, meta(400), 'x', noop)).arrayBuffer())
    const b = new Uint8Array(await (await encryptBlob(blob, meta(400), 'x', noop)).arrayBuffer())

    expect(Array.from(a)).not.toEqual(Array.from(b))
  })
})

describe('Argon2id como alternativa ao PBKDF2', () => {
  it('lacra e abre com Argon2id', async () => {
    const original = randomBytes(5000)
    const blob = new Blob([original])

    const sealed = await encryptBlob(blob, meta(blob.size), 'senha', noop, ALGO_AES_GCM_ARGON2)
    const opened = await decryptBlob(sealed, 'senha', noop)
    const back = new Uint8Array(await opened.blob.arrayBuffer())

    expect(Array.from(back)).toEqual(Array.from(original))
  }, 30_000)

  // o byte do algoritmo e o que faz o arquivo se abrir sozinho depois,
  // sem a pessoa precisar lembrar qual metodo usou
  it('grava no arquivo qual algoritmo foi usado', async () => {
    const blob = new Blob([randomBytes(300)])

    const comArgon = await encryptBlob(blob, meta(300), 'x', noop, ALGO_AES_GCM_ARGON2)
    const comPbkdf2 = await encryptBlob(blob, meta(300), 'x', noop)

    expect(new Uint8Array(await comArgon.slice(5, 6).arrayBuffer())[0]).toBe(2)
    expect(new Uint8Array(await comPbkdf2.slice(5, 6).arrayBuffer())[0]).toBe(1)
  }, 30_000)

  it('recusa senha errada tambem no Argon2id', async () => {
    const blob = new Blob([randomBytes(300)])
    const sealed = await encryptBlob(blob, meta(300), 'certa', noop, ALGO_AES_GCM_ARGON2)

    await expect(decryptBlob(sealed, 'errada', noop)).rejects.toMatchObject({
      code: 'wrong-password'
    })
  }, 30_000)

  it('recusa algoritmo que nao existe', async () => {
    const blob = new Blob([randomBytes(300)])
    const sealed = new Uint8Array(
      await (await encryptBlob(blob, meta(300), 'x', noop)).arrayBuffer()
    )

    sealed[5] = 77

    await expect(decryptBlob(new Blob([sealed]), 'x', noop)).rejects.toMatchObject({
      code: 'bad-version'
    })
  })
})
