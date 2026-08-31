import { useEffect, useState } from 'react'
import { applyClassic, NEEDS_KEY, type MethodId } from '../crypto/classic'
import { hashText, type HashId } from '../crypto/hash'
import { encryptText } from '../crypto/text'
import { useLang } from '../i18n/context'

type BookId = Exclude<MethodId, 'argon'> | 'sha256' | 'sha512' | 'sha1'

const HASH_OF: Partial<Record<BookId, HashId>> = {
  sha256: 'SHA-256',
  sha512: 'SHA-512',
  sha1: 'SHA-1'
}

// altura, largura, inclinacao e cor escolhidas uma a uma. estante de verdade
// nao tem dois livros iguais, e foi isso que deu trabalho aqui
const BOOKS: {
  id: BookId
  h: number
  w: number
  tilt: number
  bg: string
  fg: string
}[] = [
  { id: 'aes', h: 262, w: 54, tilt: 0, bg: '#2b2118', fg: '#f3ede0' },
  { id: 'caesar', h: 238, w: 42, tilt: 0, bg: '#9b2418', fg: '#fff2ea' },
  { id: 'vigenere', h: 251, w: 46, tilt: -1.5, bg: '#1f4a8b', fg: '#eef3fb' },
  { id: 'playfair', h: 244, w: 43, tilt: 0, bg: '#2f5d4a', fg: '#eef6f0' },
  { id: 'affine', h: 213, w: 33, tilt: 0, bg: '#a8895c', fg: '#2b2118' },
  { id: 'xor', h: 216, w: 32, tilt: 0, bg: '#c9b48c', fg: '#2b2118' },
  { id: 'atbash', h: 244, w: 44, tilt: 0, bg: '#4a3b2a', fg: '#f3ede0' },
  { id: 'rot13', h: 205, w: 34, tilt: 2.4, bg: '#efe8da', fg: '#2b2118' },
  { id: 'rot47', h: 197, w: 30, tilt: 0, bg: '#8e5a2b', fg: '#fdf3e6' },
  { id: 'railfence', h: 256, w: 48, tilt: 0, bg: '#6f4a22', fg: '#f8efe0' },
  { id: 'scytale', h: 268, w: 50, tilt: -1.1, bg: '#7d3b1f', fg: '#fdeee2' },
  { id: 'polybius', h: 232, w: 40, tilt: 0, bg: '#8a7a5c', fg: '#fffaf0' },
  { id: 'tap', h: 209, w: 31, tilt: 0, bg: '#403a30', fg: '#e4dac6' },
  { id: 'bacon', h: 240, w: 42, tilt: 1.6, bg: '#b8a074', fg: '#241c12' },
  { id: 'a1z26', h: 198, w: 30, tilt: 0, bg: '#3f3428', fg: '#e8dcc6' },
  { id: 'morse', h: 226, w: 38, tilt: 0, bg: '#1a1209', fg: '#e8dcc6' },
  { id: 'nato', h: 235, w: 40, tilt: 0, bg: '#4d6072', fg: '#eef3f7' },
  { id: 'braille', h: 218, w: 35, tilt: -2.2, bg: '#e3dac6', fg: '#2b2118' },
  { id: 'binary', h: 248, w: 44, tilt: 0, bg: '#d9cdb4', fg: '#2b2118' },
  { id: 'hex', h: 210, w: 33, tilt: 0, bg: '#5c4a35', fg: '#f3ede0' },
  { id: 'ascii', h: 202, w: 31, tilt: 0, bg: '#96835f', fg: '#241c12' },
  { id: 'base32', h: 228, w: 38, tilt: 0, bg: '#57493a', fg: '#f2ebdd' },
  { id: 'base64', h: 234, w: 41, tilt: -1.4, bg: '#6b5c4a', fg: '#f7f3ea' },
  { id: 'sha256', h: 266, w: 56, tilt: 0, bg: '#22303f', fg: '#e6eef5' },
  { id: 'sha512', h: 254, w: 47, tilt: 0.8, bg: '#33475c', fg: '#e6eef5' },
  { id: 'sha1', h: 220, w: 36, tilt: 0, bg: '#7a6a58', fg: '#f3ede0' }
]

const SAFE: BookId[] = ['aes', 'sha256', 'sha512']

export const Bookshelf = () => {
  const { lang, t } = useLang()
  const [open, setOpen] = useState<BookId | null>(null)
  const [sealed, setSealed] = useState('')

  const sampleKey = lang === 'pt' ? 'chave' : 'key'

  // o exemplo roda o mesmo codigo que o site usa. o AES e os hashes sao
  // assincronos, as classicas sao instantaneas, entao tudo passa por aqui
  useEffect(() => {
    if (!open) return

    let alive = true
    const noop = () => {}

    const show = (value: string) => {
      if (alive) setSealed(value)
    }

    const hash = HASH_OF[open]

    if (hash) {
      setSealed('')
      hashText(t.shelf.sample, hash, noop).then(show)
    } else if (open === 'aes') {
      setSealed('')
      encryptText(t.shelf.sample, sampleKey, noop).then((out) =>
        show(`${out.split('\n').slice(1, -1).join('').slice(0, 150)}...`)
      )
    } else {
      show(applyClassic(open as MethodId, t.shelf.sample, sampleKey, false))
    }

    return () => {
      alive = false
    }
  }, [open, sampleKey, t.shelf.sample])

  const page = open ? t.shelf.books[open] : null
  const needsKey = open && !HASH_OF[open] ? NEEDS_KEY[open as MethodId] : false

  return (
    <div>
      <div className="shelf">
        <div className="shelf-row">
          <div className="shelf-books">
            {BOOKS.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="book"
                data-on={open === item.id}
                data-gap={
                  open && BOOKS[index + 1]?.id === open
                    ? 'left'
                    : open && BOOKS[index - 1]?.id === open
                      ? 'right'
                      : undefined
                }
                style={{
                  height: item.h,
                  width: item.w,
                  background: item.bg,
                  color: item.fg,
                  ['--tilt' as string]: `${item.tilt}deg`
                }}
                onClick={() => setOpen(open === item.id ? null : item.id)}
              >
                <span className="book-title">{t.methods.names[item.id]}</span>
                <span className="book-band" />
                <span className="book-edge" />
              </button>
            ))}

            {/* dois livros deitados no fim da fileira, que e o que acontece
                em estante cheia quando nao cabe mais em pe */}
            <div className="stacked" aria-hidden="true">
              <span style={{ background: '#4a3b2a', width: 96 }} />
              <span style={{ background: '#8a7a5c', width: 84 }} />
            </div>
          </div>
        </div>

        <div className="shelf-plank" />
      </div>

      {page && open && (
        <div className="spread" key={open}>
          <div className="spread-page">
            <p className="eyebrow">{page.tag}</p>
            <h3 className="display text-[clamp(1.5rem,3vw,2.2rem)] mt-2 mb-4">
              {t.methods.names[open]}
            </h3>

            <span className="stamp-mark" data-safe={SAFE.includes(open)}>
              {SAFE.includes(open) ? t.shelf.safeYes : t.shelf.safeNo}
            </span>

            <div className="mt-8">
              <p className="eyebrow mb-2">{t.shelf.example}</p>

              <p className="m-0 text-[0.7rem] text-faint uppercase tracking-wider">
                {t.shelf.plain}
              </p>
              <p className="m-0 font-mono text-[0.92rem] break-all">{t.shelf.sample}</p>

              <p className="m-0 mt-4 text-[0.7rem] text-faint uppercase tracking-wider">
                {t.shelf.sealed}
              </p>
              <p className="m-0 font-mono text-[0.92rem] break-all leading-relaxed">
                {sealed || '...'}
              </p>

              {needsKey && (
                <p className="m-0 mt-3 text-[0.78rem] text-faint">
                  {t.shelf.key}: {sampleKey}
                </p>
              )}
            </div>
          </div>

          <div className="spread-page">
            <ol className="list-none m-0 p-0 grid gap-6">
              {page.steps.map((step, index) => (
                <li key={step.slice(0, 14)} className="flex gap-4">
                  <span className="text-[1.3rem] font-bold leading-none text-hair shrink-0">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <p className="m-0 leading-relaxed text-[0.95rem]">{step}</p>
                </li>
              ))}
            </ol>

            <button type="button" className="btn btn-ghost mt-9" onClick={() => setOpen(null)}>
              {t.shelf.close}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
