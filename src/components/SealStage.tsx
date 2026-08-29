import { useEffect, useMemo, useState } from 'react'
import { Keyhole } from './sketches'
import type { CipherStatus } from '../hooks/useCipher'

const NOISE = '#@$%&*?!+=<>/\\|0123456789ABCDEFabcdef'

const noiseChar = () => NOISE[Math.floor(Math.random() * NOISE.length)]

// troco os caracteres embaralhados a cada 45ms pra dar aquele efeito de
// coisa girando. so roda enquanto a animacao esta acontecendo
const useShimmer = (active: boolean) => {
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!active) return

    const id = setInterval(() => setTick((value) => value + 1), 45)
    return () => clearInterval(id)
  }, [active])

  return tick
}

type Mode = 'encrypt' | 'decrypt'

type Props = {
  mode: Mode
  status: CipherStatus
  progress: number
  label: string
  hint: string
  errorText: string | null
}

// as fases sao tiradas do progresso de verdade do worker. quando a barra
// esta em 40%, o texto esta 40% embaralhado. nao tem tempo chutado aqui
const phaseOf = (mode: Mode, status: CipherStatus, progress: number) => {
  if (status === 'error') return 'error'

  if (mode === 'encrypt') {
    if (status === 'idle') return 'idle'
    if (status === 'done') return 'sealed'
    if (progress < 0.15) return 'lift'
    if (progress < 0.9) return 'scramble'
    return 'fold'
  }

  if (status === 'idle') return 'sealed-idle'
  if (status === 'done') return 'revealed'
  if (progress < 0.15) return 'cracking'
  if (progress < 0.9) return 'unscramble'
  return 'unfold'
}

// ratio 0 = tudo legivel, 1 = tudo embaralhado
const scramble = (text: string, ratio: number, toNoise: boolean) => {
  const cut = Math.round(text.length * Math.min(1, Math.max(0, ratio)))

  return text
    .split('')
    .map((char, index) => {
      if (char === ' ') return char
      const noisy = toNoise ? index < cut : index >= cut
      return noisy ? noiseChar() : char
    })
    .join('')
}

const FILLER = [
  'algoritmo AES-256-GCM',
  'bloco autenticado por indice',
  'chave derivada com PBKDF2'
]

export const SealStage = ({ mode, status, progress, label, hint, errorText }: Props) => {
  const phase = phaseOf(mode, status, progress)
  const moving = status === 'working'
  const tick = useShimmer(moving)

  // a faixa de embaralhamento vai de 15% a 90% do progresso
  const ratio = Math.min(1, Math.max(0, (progress - 0.15) / 0.75))

  // o tick entra nas dependencias de proposito, e ele que faz os caracteres
  // trocarem de cara enquanto o worker trabalha
  const shown = useMemo(() => {
    void tick

    if (mode === 'encrypt') {
      if (status === 'idle' || status === 'error') return label
      return scramble(label, status === 'done' ? 1 : ratio, true)
    }

    if (status === 'idle' || status === 'error') return scramble(label, 1, true)
    if (status === 'done') return label

    return scramble(label, 1 - ratio, true)
  }, [label, mode, status, ratio, tick])

  const lines = useMemo(() => {
    void tick

    const noise = status === 'idle' ? 0 : mode === 'encrypt' ? ratio : 1 - ratio

    return FILLER.map((line) => scramble(line, noise, true))
  }, [mode, ratio, status, tick])

  const percent = Math.round(progress * 100)

  return (
    <div className="flex flex-col items-center">
      <div className="stage" data-phase={phase} data-mode={mode}>
        <div className="letter">
          <div className="paper">
            <div className="stamp">cryptographer</div>
            <p className="paper-name">{shown}</p>
            <div className="paper-body">
              {lines.map((line) => (
                <span key={line.slice(0, 6) + line.length}>{line}</span>
              ))}
            </div>
            <div className="paper-fold-shade" />
          </div>

          <div className="envelope" />

          <div className="wax">
            <div className="wax-half left">
              <div className="wax-body">
                <Keyhole size={30} />
              </div>
            </div>
            <div className="wax-half right">
              <div className="wax-body">
                <Keyhole size={30} />
              </div>
            </div>

            <svg className="wax-crack" viewBox="0 0 92 92" aria-hidden="true">
              <path d="M46 4 L40 26 L52 38 L38 52 L48 66 L44 88" />
            </svg>
          </div>
        </div>
      </div>

      <div
        className="gauge"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={hint || label}
      >
        <div className="gauge-fill" style={{ width: `${percent}%` }} />
      </div>

      <p className="gauge-label" role="status" aria-live="polite">
        {status === 'error' ? errorText : status === 'working' ? `${percent}%` : hint}
      </p>
    </div>
  )
}
