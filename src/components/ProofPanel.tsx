import { useId, useState } from 'react'
import { FileDrop } from './FileDrop'
import { useCipher } from '../hooks/useCipher'
import { MAX_FILE_BYTES } from '../crypto/format'
import { useLang } from '../i18n/context'

// assinar e selar sao a mesma tela com nomes diferentes: um arquivo, um
// segredo e um botao que produz uma marca, mais o lado que confere a marca.
// por isso os dois moram no mesmo componente em vez de duas copias
type Kind = 'sign' | 'seal'

export const ProofPanel = ({ kind }: { kind: Kind }) => {
  const { t } = useLang()

  const [lado, setLado] = useState<'fazer' | 'conferir'>('fazer')
  const [file, setFile] = useState<File | null>(null)
  const [segredo, setSegredo] = useState('')
  const [marca, setMarca] = useState('')
  const [copiado, setCopiado] = useState(false)

  const idSegredo = useId()
  const idMarca = useId()

  const { status, progress, result, errorCode, run, reset } = useCipher()

  const assinando = kind === 'sign'
  const fazendo = lado === 'fazer'
  const ocupado = status === 'working'
  const pronto = Boolean(file) && segredo.trim().length > 0 && (fazendo || marca.trim().length > 0)

  const saida = result?.kind === 'text' ? result.text : ''
  const veredito = fazendo || !saida ? null : saida === 'ok'

  const erroTexto = errorCode
    ? (t.errors[errorCode as keyof typeof t.errors] ?? t.errors.unknown)
    : null

  const limpar = () => {
    reset()
    setCopiado(false)
  }

  const comecar = () => {
    if (!pronto || !file) return

    if (assinando) {
      if (fazendo) run({ kind: 'sign', file, privada: segredo })
      else run({ kind: 'verify', file, publica: segredo, assinatura: marca })

      return
    }

    if (fazendo) run({ kind: 'hmac', file, senha: segredo })
    else run({ kind: 'hmac-check', file, senha: segredo, selo: marca })
  }

  const rotuloBotao = ocupado
    ? assinando
      ? t.hash.signWorking
      : t.hash.sealWorking
    : fazendo
      ? assinando
        ? t.hash.signAction
        : t.hash.sealAction
      : assinando
        ? t.hash.verifyAction
        : t.hash.sealCheckAction

  const rotuloSegredo = assinando ? (fazendo ? t.hash.signKey : t.hash.verifyKey) : t.form.password

  const dicaSegredo = assinando
    ? fazendo
      ? t.hash.signKeyPlaceholder
      : t.hash.verifyKeyPlaceholder
    : t.form.passwordPlaceholder

  return (
    <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-14 lg:items-start">
      <div className="sheet tilt-a p-6 sm:p-8">
        <p className="m-0 mb-6 text-[0.92rem] text-faint leading-relaxed">
          {assinando ? t.hash.signLead : t.hash.sealLead}
        </p>

        <div className="flex gap-2 mb-6">
          {(['fazer', 'conferir'] as const).map((opcao) => (
            <button
              key={opcao}
              type="button"
              className="chip"
              data-on={lado === opcao}
              disabled={ocupado}
              onClick={() => {
                setLado(opcao)
                limpar()
              }}
            >
              {opcao === 'fazer'
                ? assinando
                  ? t.hash.doSign
                  : t.hash.doSeal
                : assinando
                  ? t.hash.doVerify
                  : t.hash.doCheckSeal}
            </button>
          ))}
        </div>

        <FileDrop
          label={t.hash.drop}
          hint={t.hash.dropHint}
          formats={t.form.anyFile}
          maxBytes={MAX_FILE_BYTES}
          file={file}
          onPick={(escolhido) => {
            setFile(escolhido)
            limpar()
          }}
        />

        <div className="mt-7 grid gap-6">
          <div>
            <label className="eyebrow block mb-1" htmlFor={idSegredo}>
              {rotuloSegredo}
            </label>

            {assinando ? (
              <textarea
                id={idSegredo}
                className="field min-h-[100px] resize-y px-3 py-3 text-[0.74rem] font-mono"
                style={{ border: '1.5px solid var(--color-ink)' }}
                spellCheck={false}
                placeholder={dicaSegredo}
                value={segredo}
                onChange={(evento) => {
                  setSegredo(evento.target.value)
                  limpar()
                }}
              />
            ) : (
              <input
                id={idSegredo}
                type="password"
                className="field"
                autoComplete="off"
                placeholder={dicaSegredo}
                value={segredo}
                onChange={(evento) => {
                  setSegredo(evento.target.value)
                  limpar()
                }}
              />
            )}
          </div>

          {!fazendo && (
            <div>
              <label className="eyebrow block mb-1" htmlFor={idMarca}>
                {assinando ? t.hash.verifySig : t.hash.sealCheck}
              </label>
              <textarea
                id={idMarca}
                className="field min-h-[90px] resize-y px-3 py-3 text-[0.74rem] font-mono"
                style={{ border: '1.5px solid var(--color-ink)' }}
                spellCheck={false}
                placeholder={assinando ? t.hash.verifySigPlaceholder : t.hash.sealCheckPlaceholder}
                value={marca}
                onChange={(evento) => {
                  setMarca(evento.target.value)
                  limpar()
                }}
              />
            </div>
          )}
        </div>

        <div className="mt-8">
          <button type="button" className="btn" disabled={!pronto || ocupado} onClick={comecar}>
            {rotuloBotao}
          </button>
        </div>
      </div>

      <div>
        <div className="sheet-soft p-6 min-h-[140px] flex items-center">
          {ocupado ? (
            <p className="m-0 font-mono text-[0.95rem]">{Math.round(progress * 100)}%</p>
          ) : fazendo && saida ? (
            <p className="m-0 font-mono text-[0.72rem] break-all leading-relaxed">{saida}</p>
          ) : veredito !== null ? (
            <p
              className="m-0 text-[1rem] font-bold leading-relaxed"
              role="status"
              style={{ color: veredito ? 'var(--color-pen)' : 'var(--color-wax)' }}
            >
              {veredito
                ? assinando
                  ? t.hash.verifyOk
                  : t.hash.sealOk
                : assinando
                  ? t.hash.verifyNo
                  : t.hash.sealNo}
            </p>
          ) : (
            <p className="m-0 font-mono text-[0.95rem]">...</p>
          )}
        </div>

        {fazendo && saida && (
          <div className="rise mt-4">
            <span className="eyebrow block mb-2">
              {assinando ? t.hash.signOut : t.hash.sealOut}
            </span>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={async () => {
                await navigator.clipboard.writeText(saida)
                setCopiado(true)
              }}
            >
              {copiado ? t.hash.copied : t.hash.copy}
            </button>
          </div>
        )}

        {erroTexto && (
          <p className="m-0 mt-5 text-[0.88rem] text-wax leading-relaxed" role="alert">
            {erroTexto}
          </p>
        )}
      </div>
    </div>
  )
}
