import { useMemo, useState } from 'react'
import { useLang } from '../../i18n/context'

// os numeros sao minusculos de proposito: com primo de verdade a conta some
// numa fila de 600 digitos e ninguem enxerga o que aconteceu. aqui da pra
// acompanhar cada passo na mao
const PRIMO = 23
const BASE = 5

const potModular = (base: number, expoente: number, modulo: number) => {
  let resultado = 1
  let atual = base % modulo
  let resto = expoente

  while (resto > 0) {
    if (resto & 1) resultado = (resultado * atual) % modulo
    atual = (atual * atual) % modulo
    resto >>= 1
  }

  return resultado
}

// cada segredo vira uma cor, pra dar pra ver de longe que os dois chegaram
// no mesmo lugar sem nunca terem trocado a cor secreta
const cor = (valor: number) => `hsl(${(valor * 37) % 360} 52% 46%)`

export const Handshake = () => {
  const { t } = useLang()

  const [ana, setAna] = useState(6)
  const [bruno, setBruno] = useState(15)

  const conta = useMemo(() => {
    const daAna = potModular(BASE, ana, PRIMO)
    const doBruno = potModular(BASE, bruno, PRIMO)

    return {
      daAna,
      doBruno,
      finalAna: potModular(doBruno, ana, PRIMO),
      finalBruno: potModular(daAna, bruno, PRIMO)
    }
  }, [ana, bruno])

  const bate = conta.finalAna === conta.finalBruno

  const pessoa = (
    nome: string,
    segredo: number,
    trocar: (valor: number) => void,
    publico: number,
    final: number
  ) => (
    <div className="hs-lado">
      <p className="hs-nome">{nome}</p>

      <label className="hs-campo">
        <span>{t.lab.hand.secret}</span>
        <input
          type="range"
          min={2}
          max={20}
          value={segredo}
          onChange={(evento) => trocar(Number(evento.target.value))}
        />
        <b style={{ color: cor(segredo) }}>{segredo}</b>
      </label>

      <p className="hs-linha">
        <span>{t.lab.hand.sends}</span>
        <b>{publico}</b>
      </p>

      <div className="hs-pote" style={{ background: cor(final) }} />
      <p className="hs-final">
        {t.lab.hand.arrives} <b>{final}</b>
      </p>
    </div>
  )

  return (
    <div className="hs">
      <p className="hs-topo">
        {t.lab.hand.public} <b>{BASE}</b> {t.lab.hand.and} <b>{PRIMO}</b>
      </p>

      <div className="hs-mesa">
        {pessoa(t.lab.hand.her, ana, setAna, conta.daAna, conta.finalAna)}

        <div className="hs-meio">
          <span className="hs-troca">{conta.daAna}</span>
          <span className="hs-seta">→</span>
          <span className="hs-seta">←</span>
          <span className="hs-troca">{conta.doBruno}</span>
          <p className="hs-espia">{t.lab.hand.spy}</p>
        </div>

        {pessoa(t.lab.hand.him, bruno, setBruno, conta.doBruno, conta.finalBruno)}
      </div>

      <p className="hs-veredito" data-ok={bate}>
        {bate ? t.lab.hand.same : t.lab.hand.diff}
      </p>
    </div>
  )
}
