import { useEffect, useState } from 'react'
import { useLang } from '../i18n/context'

const KEY = 'cryptographer:warn'

// o aviso mais importante do site nao pode ser uma faixa fixa que a pessoa
// para de enxergar depois de dois minutos. aparece embaixo, ela le, fecha,
// e nao volta a incomodar
export const WarningBar = () => {
  const { t } = useLang()
  const [show, setShow] = useState(false)

  useEffect(() => {
    let seen = false

    try {
      seen = localStorage.getItem(KEY) === '1'
    } catch {
      // armazenamento bloqueado, mostra o aviso do mesmo jeito
    }

    if (!seen) {
      const id = setTimeout(() => setShow(true), 700)
      return () => clearTimeout(id)
    }
  }, [])

  const close = () => {
    setShow(false)

    try {
      localStorage.setItem(KEY, '1')
    } catch {
      // sem problema, ele aparece de novo na proxima visita
    }
  }

  if (!show) return null

  return (
    <div className="warnbar" role="status">
      <div className="warnbar-card">
        <p className="m-0 text-[0.92rem] leading-relaxed">{t.warn}</p>

        <button type="button" className="btn shrink-0" onClick={close}>
          {t.warnOk}
        </button>
      </div>
    </div>
  )
}
