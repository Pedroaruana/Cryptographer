import { useRef, useState } from 'react'
import { matchesAccept } from '../lib/fileTypes'
import { useLang } from '../i18n/context'

type Props = {
  label: string
  hint: string
  // lista legivel do que entra, tipo "PNG, BMP ou WAV". o accept e o que o
  // navegador filtra, isso aqui e o que a pessoa le
  formats: string
  accept?: string
  maxBytes: number
  file: File | null
  onPick: (file: File) => void
}

const enxuto = (valor: number, casas: number) =>
  Number.isInteger(valor) ? String(valor) : valor.toFixed(casas)

const readable = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${enxuto(bytes / 1024, 1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${enxuto(bytes / 1024 / 1024, 1)} MB`

  return `${enxuto(bytes / 1024 / 1024 / 1024, 2)} GB`
}

export const FileDrop = ({ label, hint, formats, accept, maxBytes, file, onPick }: Props) => {
  const { t } = useLang()
  const inputRef = useRef<HTMLInputElement>(null)
  const [over, setOver] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // conferir aqui evita a pessoa escolher o arquivo, digitar a senha, clicar
  // e so entao descobrir que nao ia dar certo
  const check = (picked: File) => {
    if (!matchesAccept(picked, accept)) {
      setError(t.form.wrongType.replace('{ext}', formats))
      return
    }

    if (picked.size > maxBytes) {
      setError(
        t.form.tooBig.replace('{max}', readable(maxBytes)).replace('{size}', readable(picked.size))
      )
      return
    }

    if (picked.size === 0) {
      setError(t.form.emptyFile)
      return
    }

    setError(null)
    onPick(picked)
  }

  return (
    <div>
      {/* botao de verdade em vez de div com clique: assim recebe foco,
          abre com Enter ou espaco e o leitor de tela anuncia como botao */}
      <button
        type="button"
        className="dropzone w-full px-6 py-10 text-center cursor-pointer"
        data-over={over}
        data-bad={Boolean(error)}
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => {
          event.preventDefault()
          setOver(true)
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setOver(false)

          const dropped = event.dataTransfer.files[0]
          if (dropped) check(dropped)
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(event) => {
            const picked = event.target.files?.[0]
            if (picked) check(picked)

            // limpo pra dar pra escolher o mesmo arquivo duas vezes seguidas
            event.target.value = ''
          }}
        />

        {file && !error ? (
          <div className="rise">
            <p className="m-0 font-bold break-all">{file.name}</p>
            <p className="m-0 mt-1 text-[0.82rem] text-faint">{readable(file.size)}</p>
          </div>
        ) : (
          <div>
            <p className="m-0 font-bold">{label}</p>
            <p className="m-0 mt-1 text-[0.82rem] text-faint">{hint}</p>

            {/* formatos e limite saem do proprio componente, entao nunca
                divergem do que ele de fato aceita */}
            <p className="m-0 mt-3 text-[0.78rem] text-faint">
              <span className="drop-spec">{t.form.accepts}</span> {formats}
            </p>
            <p className="m-0 mt-0.5 text-[0.78rem] text-faint">
              <span className="drop-spec">{t.form.limit}</span> {readable(maxBytes)}
            </p>
          </div>
        )}
      </button>

      {error && (
        <p className="rise m-0 mt-3 text-[0.85rem] text-wax leading-relaxed" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
