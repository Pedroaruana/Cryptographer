import { CLASSIC_IDS, type MethodId } from '../crypto/classic'
import { useLang } from '../i18n/context'

type Props = {
  value: MethodId
  onChange: (id: MethodId) => void
  // cifra classica so mexe em texto, entao no modo arquivo elas somem
  textMode: boolean
  disabled: boolean
}

export const MethodPicker = ({ value, onChange, textMode, disabled }: Props) => {
  const { t } = useLang()

  return (
    <div className="grid gap-4">
      <div>
        <span className="eyebrow block mb-2">{t.methods.secure}</span>

        <div className="flex flex-wrap gap-2">
          {(['aes', 'argon'] as const).map((id) => (
            <button
              key={id}
              type="button"
              className="chip"
              data-on={value === id}
              disabled={disabled}
              onClick={() => onChange(id)}
            >
              {t.methods.names[id]}
              <span className="opacity-70 text-[0.72rem]">{t.methods.kdfNote[id]}</span>
            </button>
          ))}
        </div>

        {value === 'argon' && (
          <p className="m-0 mt-3 text-[0.82rem] text-faint leading-relaxed">
            {t.methods.argonNote}
          </p>
        )}
      </div>

      {textMode && (
        <div>
          <span className="eyebrow block mb-2">{t.methods.classic}</span>

          <div className="flex flex-wrap gap-2">
            {CLASSIC_IDS.map((id) => (
              <button
                key={id}
                type="button"
                className="chip"
                data-on={value === id}
                disabled={disabled}
                onClick={() => onChange(id)}
              >
                {t.methods.names[id]}
              </button>
            ))}
          </div>
        </div>
      )}

      {!textMode && <p className="m-0 text-[0.8rem] text-faint">{t.methods.onlyText}</p>}

      {/* escolheu uma classica, aparece na hora o que ela faz e o aviso de
          que ela nao protege nada. o texto e o mesmo do livro da estante,
          pra explicacao nao divergir em dois lugares */}
      {textMode && value !== 'aes' && value !== 'argon' && (
        <div className="method-note" key={value}>
          <p className="m-0 mb-1 text-[0.78rem] uppercase tracking-wider text-wax">
            {t.shelf.safeNo}
          </p>
          <p className="m-0 text-[0.85rem] font-bold">{t.shelf.books[value].tag}</p>
          <p className="m-0 mt-1 text-[0.85rem] leading-relaxed text-faint">
            {t.shelf.books[value].steps[0]}
          </p>
        </div>
      )}
    </div>
  )
}
