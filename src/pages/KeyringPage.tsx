import { useEffect, useId, useMemo, useState } from 'react'
import { FileDrop } from '../components/FileDrop'
import { SealStage } from '../components/SealStage'
import { useCipher } from '../hooks/useCipher'
import { gerarPar } from '../crypto/keys'
import { juntarTexto, repartirTexto } from '../crypto/shamir'
import { CryptoError, MAX_FILE_BYTES, PK_EXTENSION } from '../crypto/format'
import { useLang } from '../i18n/context'

type Aba = 'par' | 'trancar' | 'repartir'

// o texto grande de chave, assinatura ou parte sempre aparece do mesmo jeito:
// caixa somente leitura, com botao de copiar do lado
const Bloco = ({
  label,
  hint,
  value,
  linhas = 5
}: {
  label: string
  hint?: string
  value: string
  linhas?: number
}) => {
  const { t } = useLang()
  const [copiado, setCopiado] = useState(false)

  return (
    <div>
      <span className="eyebrow block mb-1">{label}</span>

      <textarea
        readOnly
        rows={linhas}
        value={value}
        className="sheet-soft w-full p-3 text-[0.72rem] font-mono resize-y break-all"
        onFocus={(evento) => evento.currentTarget.select()}
      />

      {hint && <p className="m-0 mt-1 text-[0.78rem] text-faint leading-relaxed">{hint}</p>}

      <button
        type="button"
        className="btn btn-ghost mt-2"
        onClick={async () => {
          await navigator.clipboard.writeText(value)
          setCopiado(true)
        }}
      >
        {copiado ? t.chaveiro.copied : t.chaveiro.copy}
      </button>
    </div>
  )
}

export const KeyringPage = () => {
  const { t } = useLang()

  const [aba, setAba] = useState<Aba>('par')

  // o par fica so na memoria da aba, de proposito. guardar no navegador seria
  // guardar chave privada em disco sem a pessoa pedir
  const [par, setPar] = useState<{ publica: string; privada: string } | null>(null)
  const [gerando, setGerando] = useState(false)

  const [modo, setModo] = useState<'trancar' | 'abrir'>('trancar')
  const [file, setFile] = useState<File | null>(null)
  const [chaveDeles, setChaveDeles] = useState('')
  const [minhaChave, setMinhaChave] = useState('')

  const [segredo, setSegredo] = useState('')
  const [quantas, setQuantas] = useState(5)
  const [bastam, setBastam] = useState(3)
  const [partes, setPartes] = useState<string[]>([])
  const [colado, setColado] = useState('')
  const [remontado, setRemontado] = useState('')
  const [erroLocal, setErroLocal] = useState<string | null>(null)

  const idDeles = useId()
  const idMinha = useId()
  const idSegredo = useId()
  const idColado = useId()

  const { status, progress, result, errorCode, run, reset } = useCipher()

  const ocupado = status === 'working'
  const trancando = modo === 'trancar'

  const pronto = Boolean(file) && (trancando ? chaveDeles.trim() : minhaChave.trim())

  const linkDownload = useMemo(
    () => (result?.kind === 'file' ? URL.createObjectURL(result.blob) : null),
    [result]
  )

  useEffect(() => {
    return () => {
      if (linkDownload) URL.revokeObjectURL(linkDownload)
    }
  }, [linkDownload])

  const erroTexto = errorCode
    ? (t.errors[errorCode as keyof typeof t.errors] ?? t.errors.unknown)
    : null

  const gerar = async () => {
    setGerando(true)

    try {
      setPar(await gerarPar())
    } finally {
      setGerando(false)
    }
  }

  const comecar = () => {
    if (!pronto || !file) return

    if (trancando) run({ kind: 'seal-for', file, publica: chaveDeles })
    else run({ kind: 'open-with', file, privada: minhaChave })
  }

  const repartir = () => {
    setErroLocal(null)
    setRemontado('')

    try {
      setPartes(repartirTexto(segredo, quantas, bastam))
    } catch (erro) {
      setPartes([])
      setErroLocal(
        erro instanceof CryptoError
          ? (t.errors[erro.code as keyof typeof t.errors] ?? t.errors.unknown)
          : t.errors.unknown
      )
    }
  }

  const remontar = () => {
    setErroLocal(null)

    try {
      // uma linha em branco separa uma parte da outra
      setRemontado(juntarTexto(colado.split(/\n\s*\n/)))
    } catch (erro) {
      setRemontado('')
      setErroLocal(
        erro instanceof CryptoError
          ? (t.errors[erro.code as keyof typeof t.errors] ?? t.errors.unknown)
          : t.errors.unknown
      )
    }
  }

  return (
    <section className="wrap py-14">
      <p className="eyebrow">{t.chaveiro.eyebrow}</p>
      <h1 className="display text-[clamp(2.2rem,6vw,3.6rem)] mt-2 mb-4">{t.chaveiro.title}</h1>
      <p className="max-w-[64ch] text-faint m-0 leading-relaxed">{t.chaveiro.lead}</p>

      <div className="mt-10 flex flex-wrap gap-2">
        {(['par', 'trancar', 'repartir'] as const).map((opcao) => (
          <button
            key={opcao}
            type="button"
            className="chip"
            data-on={aba === opcao}
            disabled={ocupado}
            onClick={() => {
              setAba(opcao)
              reset()
              setErroLocal(null)
            }}
          >
            {opcao === 'par'
              ? t.chaveiro.tabPair
              : opcao === 'trancar'
                ? t.chaveiro.tabSeal
                : t.chaveiro.tabSplit}
          </button>
        ))}
      </div>

      {aba === 'par' && (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:items-start">
          <div className="sheet tilt-a p-6 sm:p-8">
            <h2 className="text-[1.15rem] font-bold m-0 mb-2">{t.chaveiro.pairTitle}</h2>
            <p className="m-0 mb-6 text-[0.92rem] text-faint leading-relaxed">
              {t.chaveiro.pairLead}
            </p>

            <button type="button" className="btn" disabled={gerando} onClick={gerar}>
              {gerando ? t.chaveiro.generating : par ? t.chaveiro.again : t.chaveiro.generate}
            </button>

            <p className="mt-6 mb-0 text-[0.85rem] text-wax leading-relaxed">
              {t.chaveiro.warnKeep}
            </p>
          </div>

          <div className="grid gap-7">
            {par ? (
              <>
                <Bloco
                  label={t.chaveiro.publicLabel}
                  hint={t.chaveiro.publicHint}
                  value={par.publica}
                />
                <Bloco
                  label={t.chaveiro.privateLabel}
                  hint={t.chaveiro.privateHint}
                  value={par.privada}
                  linhas={6}
                />
              </>
            ) : (
              <div className="sheet-soft p-8 text-center text-[0.9rem] text-faint">
                {t.chaveiro.pairLead}
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'trancar' && (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:items-start">
          <div className="sheet tilt-a p-6 sm:p-8">
            <div className="flex gap-2 mb-6">
              {(['trancar', 'abrir'] as const).map((opcao) => (
                <button
                  key={opcao}
                  type="button"
                  className="chip"
                  data-on={modo === opcao}
                  disabled={ocupado}
                  onClick={() => {
                    setModo(opcao)
                    setFile(null)
                    reset()
                  }}
                >
                  {opcao === 'trancar' ? t.chaveiro.sealDo : t.chaveiro.sealOpen}
                </button>
              ))}
            </div>

            <FileDrop
              label={trancando ? t.chaveiro.drop : t.chaveiro.dropSealed}
              hint={t.chaveiro.dropHint}
              formats={trancando ? t.form.anyFile : PK_EXTENSION}
              accept={trancando ? undefined : PK_EXTENSION}
              maxBytes={MAX_FILE_BYTES}
              file={file}
              onPick={(escolhido) => {
                setFile(escolhido)
                reset()
              }}
            />

            <div className="mt-7">
              <label className="eyebrow block mb-1" htmlFor={trancando ? idDeles : idMinha}>
                {trancando ? t.chaveiro.theirKey : t.chaveiro.myKey}
              </label>

              <textarea
                id={trancando ? idDeles : idMinha}
                className="field min-h-[110px] resize-y px-3 py-3 text-[0.74rem] font-mono"
                style={{ border: '1.5px solid var(--color-ink)' }}
                spellCheck={false}
                placeholder={
                  trancando ? t.chaveiro.theirKeyPlaceholder : t.chaveiro.myKeyPlaceholder
                }
                value={trancando ? chaveDeles : minhaChave}
                onChange={(evento) => {
                  if (trancando) setChaveDeles(evento.target.value)
                  else setMinhaChave(evento.target.value)

                  if (status !== 'idle') reset()
                }}
              />
            </div>

            <div className="mt-8">
              <button type="button" className="btn" disabled={!pronto || ocupado} onClick={comecar}>
                {ocupado
                  ? trancando
                    ? t.chaveiro.sealWorking
                    : t.chaveiro.openWorking
                  : trancando
                    ? t.chaveiro.sealAction
                    : t.chaveiro.openAction}
              </button>
            </div>
          </div>

          <div className="lg:pt-6">
            <SealStage
              mode={trancando ? 'encrypt' : 'decrypt'}
              status={status}
              progress={progress}
              label={file?.name ?? (trancando ? t.chaveiro.drop : t.chaveiro.dropSealed)}
              hint={
                status === 'done' ? (trancando ? t.chaveiro.sealDone : t.chaveiro.openDone) : ''
              }
              errorText={erroTexto}
            />

            {result?.kind === 'file' && linkDownload && (
              <div className="rise mt-6 flex justify-center">
                <a className="btn no-underline" href={linkDownload} download={result.name}>
                  {trancando ? t.chaveiro.sealDownload : t.chaveiro.openDownload}
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {aba === 'repartir' && (
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:items-start">
          <div className="sheet tilt-a p-6 sm:p-8">
            <p className="m-0 mb-6 text-[0.92rem] text-faint leading-relaxed">
              {t.chaveiro.splitLead}
            </p>

            <label className="eyebrow block mb-1" htmlFor={idSegredo}>
              {t.chaveiro.secret}
            </label>
            <textarea
              id={idSegredo}
              className="field min-h-[90px] resize-y px-3 py-3"
              style={{ border: '1.5px solid var(--color-ink)' }}
              placeholder={t.chaveiro.secretPlaceholder}
              value={segredo}
              onChange={(evento) => setSegredo(evento.target.value)}
            />

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div>
                <span className="eyebrow block mb-2">{t.chaveiro.parts}</span>
                <div className="flex flex-wrap gap-2">
                  {[3, 4, 5, 6, 8].map((numero) => (
                    <button
                      key={numero}
                      type="button"
                      className="chip"
                      data-on={quantas === numero}
                      onClick={() => {
                        setQuantas(numero)
                        if (bastam > numero) setBastam(numero)
                      }}
                    >
                      {numero}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <span className="eyebrow block mb-2">{t.chaveiro.need}</span>
                <div className="flex flex-wrap gap-2">
                  {[2, 3, 4, 5].map((numero) => (
                    <button
                      key={numero}
                      type="button"
                      className="chip"
                      data-on={bastam === numero}
                      disabled={numero > quantas}
                      onClick={() => setBastam(numero)}
                    >
                      {numero}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button type="button" className="btn" disabled={!segredo.trim()} onClick={repartir}>
                {t.chaveiro.splitAction}
              </button>
            </div>

            <p className="mt-6 mb-0 text-[0.85rem] text-wax leading-relaxed">
              {t.chaveiro.warnSplit}
            </p>
          </div>

          <div className="grid gap-7">
            {partes.length > 0 && (
              <div className="rise grid gap-5">
                <p className="m-0 text-[0.9rem] font-bold">
                  {t.chaveiro.splitDone.replace('{n}', String(partes.length))}
                </p>

                {partes.map((parte, indice) => (
                  <Bloco
                    key={parte.slice(40, 70)}
                    label={t.chaveiro.partLabel.replace('{n}', String(indice + 1))}
                    value={parte}
                    linhas={3}
                  />
                ))}
              </div>
            )}

            <div className="sheet-soft p-6">
              <h2 className="text-[1.02rem] font-bold m-0 mb-2">{t.chaveiro.joinTitle}</h2>
              <p className="m-0 mb-4 text-[0.86rem] text-faint leading-relaxed">
                {t.chaveiro.joinLead}
              </p>

              <label className="sr-only" htmlFor={idColado}>
                {t.chaveiro.joinTitle}
              </label>
              <textarea
                id={idColado}
                className="field min-h-[130px] resize-y px-3 py-3 text-[0.72rem] font-mono"
                style={{ border: '1.5px solid var(--color-ink)' }}
                spellCheck={false}
                placeholder={t.chaveiro.joinPlaceholder}
                value={colado}
                onChange={(evento) => setColado(evento.target.value)}
              />

              <button
                type="button"
                className="btn mt-4"
                disabled={!colado.trim()}
                onClick={remontar}
              >
                {t.chaveiro.joinAction}
              </button>

              {remontado && (
                <div className="rise mt-5">
                  <p className="m-0 mb-2 text-[0.86rem] font-bold">{t.chaveiro.joinDone}</p>
                  <p className="m-0 mb-3 text-[0.8rem] text-wax leading-relaxed">
                    {t.chaveiro.joinWarn}
                  </p>
                  <p className="m-0 sheet-soft p-4 font-mono text-[0.95rem] break-all">
                    {remontado}
                  </p>
                </div>
              )}
            </div>

            {erroLocal && (
              <p className="m-0 text-[0.88rem] text-wax leading-relaxed" role="alert">
                {erroLocal}
              </p>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
