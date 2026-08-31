import { useEffect, useRef, useState } from 'react'
import { Keyhole } from '../sketches'
import { useLang } from '../../i18n/context'

const PASS = '1467'

const SECRET_PT =
  'Você achou. É exatamente isso que um desafio escondido faz com quem visita um portfólio: faz a pessoa voltar.'

const SECRET_EN =
  'You found it. This is exactly what a hidden challenge does to someone visiting a portfolio: it makes them come back.'

type Sealed = { salt: Uint8Array; iv: Uint8Array; data: ArrayBuffer }

const keyFrom = async (pass: string, salt: Uint8Array) => {
  const base = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(pass),
    'PBKDF2',
    false,
    ['deriveKey']
  )

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: salt as BufferSource, iterations: 120_000, hash: 'SHA-256' },
    base,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  )
}

export const Vault = () => {
  const { lang, t } = useLang()
  const [guess, setGuess] = useState('')
  const [open, setOpen] = useState(false)
  const [wrong, setWrong] = useState(false)
  const [shown, setShown] = useState('')

  const sealedRef = useRef<Sealed | null>(null)

  // a mensagem e lacrada de verdade quando a pagina carrega. nao existe
  // comparacao de senha em lugar nenhum, quem abre e o proprio AES
  useEffect(() => {
    let alive = true

    const lock = async () => {
      const salt = crypto.getRandomValues(new Uint8Array(16))
      const iv = crypto.getRandomValues(new Uint8Array(12))
      const key = await keyFrom(PASS, salt)

      const data = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv as BufferSource },
        key,
        new TextEncoder().encode(lang === 'pt' ? SECRET_PT : SECRET_EN)
      )

      if (alive) sealedRef.current = { salt, iv, data }
    }

    setOpen(false)
    setShown('')
    lock()

    return () => {
      alive = false
    }
  }, [lang])

  const tryOpen = async () => {
    const sealed = sealedRef.current
    if (!sealed) return

    setWrong(false)

    try {
      const key = await keyFrom(guess, sealed.salt)
      const plain = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: sealed.iv as BufferSource },
        key,
        sealed.data
      )

      setShown(new TextDecoder().decode(plain))
      setOpen(true)
    } catch {
      setWrong(true)
    }
  }

  return (
    <div
      className="vault grid gap-5 justify-items-center text-center"
      data-open={open}
      data-wrong={wrong}
    >
      <div className="vault-seal">
        <Keyhole size={30} />
      </div>

      <p className="m-0 max-w-[38ch] text-[1.02rem]">{shown || t.lab.vault.locked}</p>

      {!open && (
        <>
          <p className="m-0 max-w-[42ch] text-[0.85rem] text-faint">{t.lab.vault.clue}</p>

          <div className="flex flex-wrap gap-3 justify-center w-full max-w-[24rem]">
            <input
              className="field flex-1 min-w-[10rem]"
              value={guess}
              placeholder={t.lab.vault.try}
              spellCheck={false}
              autoComplete="off"
              onChange={(event) => {
                setGuess(event.target.value)
                setWrong(false)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Enter') tryOpen()
              }}
            />

            <button type="button" className="btn" onClick={tryOpen}>
              {t.lab.vault.open}
            </button>
          </div>

          {wrong && <p className="m-0 text-[0.85rem] text-wax">{t.lab.vault.wrong}</p>}
        </>
      )}
    </div>
  )
}
