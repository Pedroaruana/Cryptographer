import { describe, expect, it } from 'vitest'
import { matchesAccept } from '../fileTypes'

const arquivo = (name: string, type = '') => ({ name, type })

describe('o que a area de soltar aceita', () => {
  it('sem restricao, aceita tudo', () => {
    expect(matchesAccept(arquivo('qualquer.coisa'), undefined)).toBe(true)
    expect(matchesAccept(arquivo('qualquer.coisa'), '')).toBe(true)
  })

  it('aceita por extensao', () => {
    expect(matchesAccept(arquivo('cofre.cgph'), '.cgph')).toBe(true)
    expect(matchesAccept(arquivo('foto.png'), '.cgph')).toBe(false)
  })

  it('nao liga pra maiuscula', () => {
    expect(matchesAccept(arquivo('COFRE.CGPH'), '.cgph')).toBe(true)
    expect(matchesAccept(arquivo('foto.PNG', 'IMAGE/PNG'), 'image/png')).toBe(true)
  })

  // esse e o caso que estava quebrado: lista de tipos MIME recusava tudo
  it('aceita lista de tipos misturada com extensao', () => {
    const lista = 'image/png,image/bmp,image/webp,audio/wav,.wav'

    expect(matchesAccept(arquivo('foto.png', 'image/png'), lista)).toBe(true)
    expect(matchesAccept(arquivo('desenho.bmp', 'image/bmp'), lista)).toBe(true)
    expect(matchesAccept(arquivo('som.wav', 'audio/wav'), lista)).toBe(true)
    expect(matchesAccept(arquivo('doc.pdf', 'application/pdf'), lista)).toBe(false)
  })

  // alguns navegadores entregam o WAV sem tipo nenhum, e ai vale a extensao
  it('cai pra extensao quando o navegador nao informa o tipo', () => {
    const lista = 'image/png,audio/wav,.wav'

    expect(matchesAccept(arquivo('som.wav', ''), lista)).toBe(true)
    expect(matchesAccept(arquivo('som.mp3', ''), lista)).toBe(false)
  })

  it('entende curinga de familia', () => {
    expect(matchesAccept(arquivo('foto.png', 'image/png'), 'image/*')).toBe(true)
    expect(matchesAccept(arquivo('som.wav', 'audio/wav'), 'image/*')).toBe(false)
  })

  it('aguenta espaco solto na lista', () => {
    expect(matchesAccept(arquivo('foto.png', 'image/png'), ' image/png , .bmp ')).toBe(true)
  })
})
