import { unzipWithPassword, zipWithPassword } from './archive'
import { applyClassic, type MethodId } from './classic'
import { decryptBlob, encryptBlob } from './core'
import { hashBlob, type HashId } from './hash'
import { conferirSelo, selar } from './hmac'
import { abrirCom, assinar, conferir, trancarPara } from './keys'
import { CryptoError } from './format'
import { decryptText, encryptText } from './text'

// tudo pesado roda aqui dentro. se rodasse na tela principal a pagina
// congelava e a animacao nem se mexia com arquivo grande

export type WorkerRequest =
  | { kind: 'encrypt-file'; file: File; password: string; algo?: number }
  | { kind: 'decrypt-file'; file: File; password: string }
  | { kind: 'encrypt-text'; text: string; password: string; algo?: number }
  | { kind: 'decrypt-text'; text: string; password: string }
  | { kind: 'classic'; id: MethodId; text: string; key: string; back: boolean }
  | { kind: 'hash-file'; file: File; algo: HashId }
  | { kind: 'hash-text'; text: string; algo: HashId }
  | { kind: 'zip'; file: File; password: string }
  | { kind: 'unzip'; file: File; password: string }
  | { kind: 'seal-for'; file: File; publica: string }
  | { kind: 'open-with'; file: File; privada: string }
  | { kind: 'sign'; file: File; privada: string }
  | { kind: 'verify'; file: File; publica: string; assinatura: string }
  | { kind: 'hmac'; file: File; senha: string }
  | { kind: 'hmac-check'; file: File; senha: string; selo: string }

export type WorkerResponse =
  | { kind: 'progress'; value: number }
  | { kind: 'file-done'; blob: Blob; name: string }
  | { kind: 'text-done'; text: string }
  | { kind: 'failed'; code: string }

const post = (message: WorkerResponse) => self.postMessage(message)

const onProgress = (value: number) => post({ kind: 'progress', value })

self.onmessage = async (event: MessageEvent<WorkerRequest>) => {
  const request = event.data

  try {
    if (request.kind === 'encrypt-file') {
      const meta = {
        name: request.file.name,
        type: request.file.type,
        size: request.file.size
      }

      const blob = await encryptBlob(request.file, meta, request.password, onProgress, request.algo)
      post({ kind: 'file-done', blob, name: `${request.file.name}.cgph` })
      return
    }

    if (request.kind === 'decrypt-file') {
      const result = await decryptBlob(request.file, request.password, onProgress)
      post({ kind: 'file-done', blob: result.blob, name: result.meta.name })
      return
    }

    if (request.kind === 'zip') {
      const blob = await zipWithPassword(request.file, request.password, onProgress)
      post({ kind: 'file-done', blob, name: `${request.file.name}.zip` })
      return
    }

    if (request.kind === 'unzip') {
      const out = await unzipWithPassword(request.file, request.password, onProgress)
      post({ kind: 'file-done', blob: out.blob, name: out.name })
      return
    }

    if (request.kind === 'seal-for') {
      const meta = {
        name: request.file.name,
        type: request.file.type,
        size: request.file.size
      }

      const blob = await trancarPara(request.file, meta, request.publica, onProgress)
      post({ kind: 'file-done', blob, name: `${request.file.name}.cgpk` })
      return
    }

    if (request.kind === 'open-with') {
      const out = await abrirCom(request.file, request.privada, onProgress)
      post({ kind: 'file-done', blob: out.blob, name: out.meta.name })
      return
    }

    if (request.kind === 'sign') {
      post({ kind: 'text-done', text: await assinar(request.file, request.privada, onProgress) })
      return
    }

    // confere e selo voltam como sim ou nao. a tela so precisa saber disso,
    // e assim nao inventei um terceiro tipo de resposta so pra dois casos
    if (request.kind === 'verify') {
      const bate = await conferir(request.file, request.publica, request.assinatura, onProgress)
      post({ kind: 'text-done', text: bate ? 'ok' : 'nao' })
      return
    }

    if (request.kind === 'hmac') {
      post({ kind: 'text-done', text: await selar(request.file, request.senha, onProgress) })
      return
    }

    if (request.kind === 'hmac-check') {
      const bate = await conferirSelo(request.file, request.senha, request.selo, onProgress)
      post({ kind: 'text-done', text: bate ? 'ok' : 'nao' })
      return
    }

    if (request.kind === 'hash-file' || request.kind === 'hash-text') {
      const blob = request.kind === 'hash-file' ? request.file : new Blob([request.text])
      post({ kind: 'text-done', text: await hashBlob(blob, request.algo, onProgress) })
      return
    }

    // cifra classica e instantanea, mas passa pelo mesmo caminho pra tela
    // nao precisar saber de dois fluxos diferentes
    if (request.kind === 'classic') {
      onProgress(1)
      post({
        kind: 'text-done',
        text: applyClassic(request.id, request.text, request.key, request.back)
      })
      return
    }

    if (request.kind === 'encrypt-text') {
      post({
        kind: 'text-done',
        text: await encryptText(request.text, request.password, onProgress, request.algo)
      })
      return
    }

    post({ kind: 'text-done', text: await decryptText(request.text, request.password, onProgress) })
  } catch (error) {
    post({ kind: 'failed', code: error instanceof CryptoError ? error.code : 'unknown' })
  }
}
