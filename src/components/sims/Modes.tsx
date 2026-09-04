import { useEffect, useState } from 'react'
import { useLang } from '../../i18n/context'

// duas cifras do mesmo AES, uma que so embaralha e outra que tambem carimba.
// a bancada existe pra mostrar o que acontece quando alguem mexe num byte no
// meio do caminho: uma aceita calada, a outra recusa
type Estado = {
  cbc: string | null
  gcm: string | null
  erroGcm: boolean
}

const MENSAGEM = 'transferir 100 reais para a conta 4417'

const bytesParaTexto = (bytes: Uint8Array) => {
  const texto = new TextDecoder().decode(bytes)

  // byte que nao forma letra vira um quadradinho, senao o resultado do CBC
  // adulterado some da tela em vez de aparecer como lixo
  return [...texto].map((letra) => (letra.charCodeAt(0) < 32 ? '□' : letra)).join('')
}

export const Modes = () => {
  const { t } = useLang()

  const [posicao, setPosicao] = useState(6)
  const [estado, setEstado] = useState<Estado>({ cbc: null, gcm: null, erroGcm: false })

  useEffect(() => {
    let vivo = true

    const rodar = async () => {
      const dados = new TextEncoder().encode(MENSAGEM)
      const chave = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(32).fill(7),
        { name: 'AES-CBC' },
        false,
        ['encrypt', 'decrypt']
      )

      const chaveGcm = await crypto.subtle.importKey(
        'raw',
        new Uint8Array(32).fill(7),
        { name: 'AES-GCM' },
        false,
        ['encrypt', 'decrypt']
      )

      const ivCbc = new Uint8Array(16).fill(3)
      const ivGcm = new Uint8Array(12).fill(3)

      const cifradoCbc = new Uint8Array(
        await crypto.subtle.encrypt({ name: 'AES-CBC', iv: ivCbc }, chave, dados)
      )

      const cifradoGcm = new Uint8Array(
        await crypto.subtle.encrypt({ name: 'AES-GCM', iv: ivGcm }, chaveGcm, dados)
      )

      // o mesmo estrago nos dois: um bit virado no byte escolhido
      cifradoCbc[posicao] ^= 0x01
      cifradoGcm[posicao] ^= 0x01

      let cbc: string | null = null

      try {
        cbc = bytesParaTexto(
          new Uint8Array(
            await crypto.subtle.decrypt({ name: 'AES-CBC', iv: ivCbc }, chave, cifradoCbc)
          )
        )
      } catch {
        // o preenchimento do CBC as vezes tambem quebra, e ai nem ele abre
        cbc = null
      }

      let gcm: string | null = null
      let erroGcm = false

      try {
        gcm = bytesParaTexto(
          new Uint8Array(
            await crypto.subtle.decrypt({ name: 'AES-GCM', iv: ivGcm }, chaveGcm, cifradoGcm)
          )
        )
      } catch {
        erroGcm = true
      }

      if (vivo) setEstado({ cbc, gcm, erroGcm })
    }

    rodar()

    return () => {
      vivo = false
    }
  }, [posicao])

  return (
    <div className="modos">
      <p className="modos-original">
        <span>{t.lab.modes.original}</span>
        <b>{MENSAGEM}</b>
      </p>

      <label className="modos-campo">
        <span>{t.lab.modes.byte}</span>
        <input
          type="range"
          min={0}
          max={31}
          value={posicao}
          onChange={(evento) => setPosicao(Number(evento.target.value))}
        />
        <b>{posicao}</b>
      </label>

      <div className="modos-lados">
        <div className="modos-lado" data-ok="false">
          <p className="modos-nome">AES-CBC</p>
          <p className="modos-saida">{estado.cbc ?? t.lab.modes.broke}</p>
          <p className="modos-veredito">{t.lab.modes.cbc}</p>
        </div>

        <div className="modos-lado" data-ok="true">
          <p className="modos-nome">AES-GCM</p>
          <p className="modos-saida">{estado.erroGcm ? t.lab.modes.refused : (estado.gcm ?? '')}</p>
          <p className="modos-veredito">{t.lab.modes.gcm}</p>
        </div>
      </div>
    </div>
  )
}
