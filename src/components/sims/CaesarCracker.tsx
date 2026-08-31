import { useId, useMemo, useState } from 'react'
import { useLang } from '../../i18n/context'

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// frequencia das letras no portugues, em porcentagem
const PT = [
  14.63, 1.04, 3.88, 4.99, 12.57, 1.02, 1.3, 1.28, 6.18, 0.4, 0.02, 2.78, 4.74, 5.05, 10.73, 2.52,
  1.2, 6.53, 7.81, 4.34, 4.63, 1.67, 0.01, 0.21, 0.01, 0.47
]

const shiftBack = (text: string, by: number) =>
  [...text]
    .map((char) => {
      const upper = char.toUpperCase()
      const at = A.indexOf(upper)
      if (at < 0) return char

      const moved = A[(at - by + 26) % 26]
      return char === upper ? moved : moved.toLowerCase()
    })
    .join('')

export const CaesarCracker = () => {
  const { t } = useLang()
  const [text, setText] = useState(
    'D phqvdjhp vhfuhwd hvwd hvfrqglgd qhvwh whawr fliudgr frp fhvdu'
  )
  const fieldId = useId()

  const result = useMemo(() => {
    const counts = new Array(26).fill(0)
    let total = 0

    for (const char of text.toUpperCase()) {
      const at = A.indexOf(char)
      if (at >= 0) {
        counts[at]++
        total++
      }
    }

    if (total < 12) return { counts, total, shift: null as number | null }

    // qui-quadrado: qual deslocamento deixa as frequencias mais parecidas
    // com as do portugues de verdade
    let best = 0
    let bestScore = Infinity

    for (let by = 0; by < 26; by++) {
      let score = 0

      for (let i = 0; i < 26; i++) {
        const seen = (counts[(i + by) % 26] / total) * 100
        score += (seen - PT[i]) ** 2 / (PT[i] || 0.01)
      }

      if (score < bestScore) {
        bestScore = score
        best = by
      }
    }

    return { counts, total, shift: best }
  }, [text])

  const top = Math.max(1, ...result.counts)

  return (
    <div className="grid gap-6">
      <div>
        <label className="eyebrow block mb-1" htmlFor={fieldId}>
          {t.lab.crack.input}
        </label>
        <textarea
          id={fieldId}
          className="field min-h-[110px] resize-y px-3 py-3"
          style={{ border: '1.5px solid var(--color-ink)' }}
          value={text}
          spellCheck={false}
          onChange={(event) => setText(event.target.value)}
        />
      </div>

      <div>
        <p className="eyebrow mb-2">{t.lab.crack.freq}</p>

        <div className="bars">
          {result.counts.map((count, index) => (
            <span
              key={A[index]}
              className="bar"
              data-top={count === top && count > 0}
              style={{ height: `${Math.max(2, (count / top) * 118)}px` }}
            />
          ))}
        </div>

        <div className="barlabels">
          {[...A].map((char) => (
            <span key={char}>{char.toLowerCase()}</span>
          ))}
        </div>
      </div>

      <p className="verdict">
        {result.shift === null ? (
          t.lab.crack.short
        ) : (
          <>
            {t.lab.crack.found}: <b>{result.shift}</b>
            <br />
            {shiftBack(text, result.shift)}
          </>
        )}
      </p>
    </div>
  )
}
