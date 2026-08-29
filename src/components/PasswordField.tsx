import { useId, useState } from 'react'
import { useLang } from '../i18n/context'

type Props = {
  value: string
  onChange: (value: string) => void
  withMeter?: boolean
}

// medidor bem simples: tamanho conta mais que os simbolos malucos, que e o
// que a pesquisa de senha vem dizendo faz tempo. nao pretende ser exato,
// e so um empurrao visual pra pessoa nao usar 123456
const strengthOf = (value: string) => {
  if (!value) return 0

  let score = 0
  if (value.length >= 8) score++
  if (value.length >= 14) score++
  if (value.length >= 20) score++
  if (/[^a-zA-Z0-9]/.test(value) && /\d/.test(value)) score++

  return Math.min(4, score)
}

export const PasswordField = ({ value, onChange, withMeter = false }: Props) => {
  const { t } = useLang()
  const [visible, setVisible] = useState(false)
  const id = useId()

  const score = strengthOf(value)
  const words = [
    t.form.strengthWeak,
    t.form.strengthWeak,
    t.form.strengthOk,
    t.form.strengthGood,
    t.form.strengthStrong
  ]

  return (
    <div>
      <label className="eyebrow block mb-1" htmlFor={id}>
        {t.form.password}
      </label>

      <div className="flex items-end gap-3">
        <input
          id={id}
          className="field"
          type={visible ? 'text' : 'password'}
          value={value}
          placeholder={t.form.passwordPlaceholder}
          autoComplete="off"
          spellCheck={false}
          onChange={(event) => onChange(event.target.value)}
        />

        <button
          type="button"
          className="chip shrink-0"
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? t.form.hide : t.form.show}
        </button>
      </div>

      {withMeter && (
        <div className="mt-2 flex items-center gap-2">
          <div className="flex gap-1">
            {[0, 1, 2, 3].map((index) => (
              <span
                key={index}
                className="h-1.5 w-9 rounded-[1px]"
                style={{
                  background: index < score ? 'var(--color-ink)' : 'rgba(28,20,8,0.15)'
                }}
              />
            ))}
          </div>

          <span className="text-[0.78rem] text-faint">{value ? words[score] : ''}</span>
        </div>
      )}
    </div>
  )
}
