import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CircledNumber,
  SketchEnvelope,
  SketchFingerprint,
  SketchKey,
  SketchPhoto
} from './sketches'
import { useLang } from '../i18n/context'

// cada pagina do caderno usa os desenhos que combinam com o assunto dela
const SKETCHES = [
  [<SketchPhoto key="a" />, <SketchKey key="b" />, <SketchEnvelope key="c" />],
  [<SketchPhoto key="d" />, <SketchKey key="e" />, <SketchPhoto key="f" />],
  [<SketchKey key="p" />, <SketchEnvelope key="q" />, <SketchKey key="r" />],
  [<SketchPhoto key="j" />, <SketchFingerprint key="k" />, <SketchEnvelope key="l" />],
  [<SketchFingerprint key="g" />, <SketchFingerprint key="h" />, <SketchKey key="i" />],
  [<SketchKey key="m" />, <SketchPhoto key="n" />, <SketchFingerprint key="o" />]
]

const TURN = ['-0.9deg', '0.7deg', '-0.4deg']

export const StepsNote = () => {
  const { t } = useLang()
  const [page, setPage] = useState(0)
  const [way, setWay] = useState<'next' | 'back'>('next')

  const total = t.home.guide.length
  const atual = t.home.guide[page]
  const desenhos = SKETCHES[page] ?? SKETCHES[0]

  const irPara = (destino: number, direcao: 'next' | 'back') => {
    setWay(direcao)
    setPage(((destino % total) + total) % total)
  }

  const virar = (passo: number) => irPara(page + passo, passo > 0 ? 'next' : 'back')

  return (
    <div className="notebook">
      <div className="notebook-holes" aria-hidden="true" />

      {/* as abas ficam em cima, como divisorias de fichario, e do lado
          direito o atalho pra tela que faz aquilo */}
      <div className="flex flex-wrap items-center justify-between gap-3 pl-3 md:pl-20 pr-3 md:pr-8 pt-6">
        <div className="flex flex-wrap gap-2">
          {t.home.guide.map((pagina, index) => (
            <button
              key={pagina.key}
              type="button"
              className="chip"
              data-on={index === page}
              onClick={() => irPara(index, index > page ? 'next' : 'back')}
            >
              {pagina.tab}
            </button>
          ))}
        </div>

        <Link to={atual.to} className="btn guide-cta no-underline text-[0.85rem] py-2 px-3.5">
          {atual.cta} {'\u2192'}
        </Link>
      </div>

      <div
        key={atual.key}
        data-way={way}
        className="page-turn grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 pl-3 md:pl-20 pr-3 md:pr-8 py-8"
      >
        <div className="grid gap-8 content-start">
          {atual.steps.map((step, index) => (
            <div
              key={step.n}
              className="flex items-start gap-5"
              style={{ transform: `rotate(${TURN[index]})` }}
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-4 mb-1.5">
                  <CircledNumber value={step.n} />
                  <h3 className="text-[1.3rem] font-bold leading-tight m-0">{step.title}</h3>
                </div>

                <p className="m-0 text-[0.94rem] text-faint leading-relaxed max-w-[42ch]">
                  {step.text}
                </p>
              </div>

              <div className="hidden sm:block shrink-0 scale-90 origin-top-right">
                {desenhos[index]}
              </div>
            </div>
          ))}
        </div>

        <div className="lg:border-l lg:border-dashed lg:border-hair lg:pl-12">
          <h3 className="text-[1.1rem] font-bold m-0 mb-1">{atual.panelTitle}</h3>
          <p className="m-0 mb-5 text-[0.85rem] text-faint">{atual.panelLead}</p>

          {atual.rows.length > 0 && (
            <div className="anatomy">
              {atual.rows.map(([name, size, note], index) => (
                <div key={`${name}-${index}`} className="anatomy-row" data-block={index >= 6}>
                  <code className="anatomy-name">{name}</code>
                  <code className="anatomy-size">{size}</code>
                  <span className="anatomy-note">{note}</span>
                </div>
              ))}
            </div>
          )}

          {atual.notes.length > 0 && (
            <ul className="list-none m-0 p-0 grid gap-4">
              {atual.notes.map((note) => (
                <li key={note.slice(0, 16)} className="flex gap-3">
                  <span className="text-accent font-bold shrink-0">+</span>
                  <p className="m-0 text-[0.9rem] leading-relaxed text-faint">{note}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* rodape de virar pagina, com os pontinhos no meio */}
      <div className="flex items-center justify-between gap-4 pl-3 md:pl-20 pr-3 md:pr-8 pb-6">
        <button type="button" className="chip" onClick={() => virar(-1)}>
          {'<'} {t.home.guidePrev}
        </button>

        <div className="flex items-center gap-2">
          {t.home.guide.map((pagina, index) => (
            <button
              key={pagina.key}
              type="button"
              className="page-dot"
              data-on={index === page}
              aria-label={pagina.tab}
              onClick={() => irPara(index, index > page ? 'next' : 'back')}
            />
          ))}

          <span className="ml-2 text-[0.8rem] text-faint font-mono">
            {page + 1} {t.home.guideOf} {total}
          </span>
        </div>

        <button type="button" className="chip" onClick={() => virar(1)}>
          {t.home.guideNext} {'>'}
        </button>
      </div>
    </div>
  )
}
