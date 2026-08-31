import { useEffect, useId, useRef, useState } from 'react'
import { useLang } from '../../i18n/context'

export const Avalanche = () => {
  const { t } = useLang()
  const [text, setText] = useState('ataque ao amanhecer')
  const [bits, setBits] = useState<number[]>([])
  const [flipped, setFlipped] = useState<boolean[]>([])
  const [hex, setHex] = useState('')
  const [changed, setChanged] = useState<number | null>(null)
  const fieldId = useId()

  const lastRef = useRef<number[] | null>(null)

  useEffect(() => {
    let alive = true

    const run = async () => {
      const digest = new Uint8Array(
        await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
      )

      if (!alive) return

      const next: number[] = []
      digest.forEach((byte) => {
        for (let i = 7; i >= 0; i--) next.push((byte >> i) & 1)
      })

      const previous = lastRef.current
      const marks = next.map((bit, index) => Boolean(previous && previous[index] !== bit))

      setBits(next)
      setFlipped(marks)
      setChanged(previous ? marks.filter(Boolean).length : null)
      setHex([...digest].map((byte) => byte.toString(16).padStart(2, '0')).join(''))

      lastRef.current = next
    }

    run()

    return () => {
      alive = false
    }
  }, [text])

  return (
    <div className="grid gap-6">
      <div>
        <label className="eyebrow block mb-1" htmlFor={fieldId}>
          {t.lab.ava.text}
        </label>
        <input
          id={fieldId}
          className="field"
          value={text}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => setText(event.target.value)}
        />
        <p className="m-0 mt-2 text-[0.8rem] text-faint">{t.lab.ava.hint}</p>
      </div>

      <div>
        <p className="eyebrow mb-2">{t.lab.ava.bits}</p>

        <div className="bits">
          {bits.map((bit, index) => (
            <span key={index} className="bit" data-one={bit === 1} data-flip={flipped[index]} />
          ))}
        </div>

        <p className="m-0 mt-3 font-mono text-[0.85rem] text-faint">
          {changed === null ? (
            t.lab.ava.start
          ) : (
            <>
              <strong className="text-wax text-[1.1rem]">{changed}</strong> {t.lab.ava.changed} (
              {Math.round((changed / 256) * 100)}%)
            </>
          )}
        </p>
      </div>

      <div>
        <p className="eyebrow mb-1">{t.lab.ava.hex}</p>
        <p className="m-0 font-mono text-[0.9rem] break-all">{hex}</p>
      </div>
    </div>
  )
}
