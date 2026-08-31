import { useEffect, useId, useMemo, useState } from 'react'
import { useLang } from '../../i18n/context'

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

// fiacao dos rotores I, II e III da Enigma militar, e o refletor B
const WIRE = [
  { w: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
  { w: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
  { w: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' }
]

const REFLECT = 'YRUHQSLDPXNGOKMIEBFZCWVJAT'

// posicao 0 e o rotor da esquerda, 2 o da direita, que anda a cada tecla
const runEnigma = (text: string) => {
  const pos = [0, 0, 0]
  let out = ''

  for (const raw of text.toUpperCase()) {
    if (A.indexOf(raw) < 0) {
      out += raw
      continue
    }

    // o duplo passo do rotor do meio, que e o detalhe que quase toda
    // simulacao na internet erra
    if (A[pos[1]] === WIRE[1].notch) {
      pos[1] = (pos[1] + 1) % 26
      pos[0] = (pos[0] + 1) % 26
    } else if (A[pos[2]] === WIRE[2].notch) {
      pos[1] = (pos[1] + 1) % 26
    }
    pos[2] = (pos[2] + 1) % 26

    let c = A.indexOf(raw)
    for (let i = 2; i >= 0; i--) c = (A.indexOf(WIRE[i].w[(c + pos[i]) % 26]) - pos[i] + 26) % 26
    c = A.indexOf(REFLECT[c])
    for (let i = 0; i < 3; i++) c = (WIRE[i].w.indexOf(A[(c + pos[i]) % 26]) - pos[i] + 26) % 26

    out += A[c]
  }

  return { out, pos }
}

export const Enigma = () => {
  const { t } = useLang()
  const [text, setText] = useState('socorro')
  const [bump, setBump] = useState(false)
  const fieldId = useId()

  const { out, pos } = useMemo(() => runEnigma(text), [text])
  const last = out.replace(/[^A-Z]/g, '').slice(-1)

  useEffect(() => {
    setBump(true)
    const id = setTimeout(() => setBump(false), 170)
    return () => clearTimeout(id)
  }, [text])

  return (
    <div className="grid gap-6">
      <div>
        <p className="eyebrow mb-2">{t.lab.enigma.rotors}</p>

        <div className="flex gap-3 justify-center">
          {[0, 1, 2].map((slot) => (
            <div key={slot} className="rotor">
              <b style={{ transform: bump ? 'translateY(-4px)' : undefined }}>{A[pos[slot]]}</b>
              <small>{['I', 'II', 'III'][slot]}</small>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="eyebrow block mb-1" htmlFor={fieldId}>
          {t.lab.enigma.type}
        </label>
        <input
          id={fieldId}
          className="field"
          value={text}
          spellCheck={false}
          autoComplete="off"
          onChange={(event) => setText(event.target.value)}
        />
      </div>

      <div>
        <p className="eyebrow mb-1">{t.lab.enigma.out}</p>
        <p className="m-0 font-mono text-[1.1rem] break-all">{out || '...'}</p>

        <div className="lamps">
          {[...A].map((char) => (
            <span key={char} className="lamp" data-on={char === last}>
              {char}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" className="btn btn-ghost" onClick={() => setText('')}>
          {t.lab.enigma.reset}
        </button>
        <span className="text-[0.82rem] text-faint font-mono">
          {t.lab.enigma.at} {A[pos[0]] + A[pos[1]] + A[pos[2]]}
        </span>
      </div>
    </div>
  )
}
