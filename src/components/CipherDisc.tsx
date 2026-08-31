import { useId, useRef, useState } from 'react'
import { applyClassic } from '../crypto/classic'
import { useLang } from '../i18n/context'

const OUTER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const STEP = 360 / 26

const ring = (letters: string[], radius: number, size: number) =>
  letters.map((letter, index) => {
    const angle = ((index / letters.length) * 360 - 90) * (Math.PI / 180)

    return (
      <text
        key={letter + index}
        x={140 + Math.cos(angle) * radius}
        y={140 + Math.sin(angle) * radius + size * 0.34}
        fontSize={size}
        textAnchor="middle"
        className="f-ink"
        fontFamily="inherit"
        fontWeight="700"
      >
        {letter}
      </text>
    )
  })

const ticks = Array.from({ length: 26 }, (_, index) => {
  const angle = ((index / 26) * 360 - 90) * (Math.PI / 180)

  return (
    <line
      key={index}
      x1={140 + Math.cos(angle) * 104}
      y1={140 + Math.sin(angle) * 104}
      x2={140 + Math.cos(angle) * 112}
      y2={140 + Math.sin(angle) * 112}
      className="s-ink"
      strokeWidth="1.1"
      opacity="0.45"
    />
  )
})

export const CipherDisc = () => {
  const { t } = useLang()
  const boxRef = useRef<SVGSVGElement>(null)
  const dragRef = useRef<{ from: number; base: number } | null>(null)

  const [shift, setShift] = useState(7)
  const [text, setText] = useState(t.disc.sample)
  const fieldId = useId()

  // angulo do ponteiro em relacao ao centro do disco. e assim que da pra
  // girar o anel seguindo a mao em vez de so arrastar pros lados
  const angleAt = (clientX: number, clientY: number) => {
    const box = boxRef.current?.getBoundingClientRect()
    if (!box) return 0

    const x = clientX - (box.left + box.width / 2)
    const y = clientY - (box.top + box.height / 2)

    return (Math.atan2(y, x) * 180) / Math.PI
  }

  const onDown = (event: React.PointerEvent<SVGSVGElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = { from: angleAt(event.clientX, event.clientY), base: shift }
  }

  const onMove = (event: React.PointerEvent<SVGSVGElement>) => {
    const drag = dragRef.current
    if (!drag) return

    let moved = angleAt(event.clientX, event.clientY) - drag.from
    if (moved > 180) moved -= 360
    if (moved < -180) moved += 360

    // trava de letra em letra, senao o anel para no meio de duas e ninguem
    // consegue ler o par
    const steps = Math.round(moved / STEP)
    setShift((((drag.base - steps) % 26) + 26) % 26)
  }

  const onUp = () => {
    dragRef.current = null
  }

  const turn = (by: number) => setShift((current) => (((current + by) % 26) + 26) % 26)

  const result = applyClassic('caesar', text, String(shift), false)

  return (
    <div className="grid gap-6 justify-items-center">
      <div className="disc">
        <svg
          ref={boxRef}
          viewBox="0 0 280 280"
          className="w-full max-w-[320px] touch-none select-none cursor-grab active:cursor-grabbing"
          role="img"
          aria-label={t.disc.hint}
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
        >
          <circle cx="140" cy="140" r="132" className="f-card s-ink" strokeWidth="1.8" />
          <circle
            cx="140"
            cy="140"
            r="104"
            fill="none"
            className="s-ink"
            strokeWidth="1.2"
            opacity="0.6"
          />
          {ticks}
          {ring(OUTER, 118, 13)}

          {/* o anel de dentro gira de verdade, igual ao disco de metal.
              a letra que parar embaixo do marcador azul e o par do A */}
          <g
            style={{
              transform: `rotate(${-shift * STEP}deg)`,
              transformOrigin: '140px 140px',
              transition: 'transform .16s var(--ease-paper)'
            }}
          >
            <circle cx="140" cy="140" r="96" className="f-paper-deep s-ink" strokeWidth="1.5" />
            <circle
              cx="140"
              cy="140"
              r="62"
              fill="none"
              className="s-ink"
              strokeWidth="1"
              opacity="0.5"
            />
            {ring(OUTER, 80, 12)}
          </g>

          {/* o pino do meio, que segura os dois discos */}
          <circle cx="140" cy="140" r="14" fill="#9b2418" stroke="#6f1810" strokeWidth="1.4" />
          <circle cx="136" cy="136" r="3.5" fill="#fff6f0" opacity="0.5" />

          {/* marca de leitura no topo, onde se le o par de letras */}
          <path
            d="M140 6 L134 20 L146 20 Z"
            fill="#1f4a8b"
            stroke="#1f4a8b"
            strokeWidth="1"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div className="flex items-center gap-3">
        <button type="button" className="chip" aria-label={t.disc.back} onClick={() => turn(-1)}>
          {'<'}
        </button>

        <span className="text-[0.9rem]">
          A → <strong>{OUTER[shift % 26]}</strong>
        </span>

        <button type="button" className="chip" aria-label={t.disc.forward} onClick={() => turn(1)}>
          {'>'}
        </button>

        <span className="text-[0.82rem] text-faint">
          {t.disc.shift}: {shift}
        </span>
      </div>

      <div className="w-full max-w-[420px]">
        <label className="eyebrow block mb-1" htmlFor={fieldId}>
          {t.disc.plain}
        </label>
        <input
          id={fieldId}
          className="field"
          value={text}
          spellCheck={false}
          onChange={(event) => setText(event.target.value)}
        />

        <p className="eyebrow mt-5 mb-1">{t.disc.result}</p>
        <p className="m-0 font-mono text-[1.05rem] break-all leading-relaxed">{result}</p>
      </div>
    </div>
  )
}
