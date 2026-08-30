import { CryptoError } from './format'

// ZIP com senha existe pra um caso que o .cgph nao resolve: quando a pessoa
// do outro lado nao vai entrar neste site. o arquivo abre no 7-Zip, no WinRAR
// e no Keka, pedindo a senha.
//
// uso AES-256, que e o padrao forte do formato. o ZipCrypto antigo abre
// direto no Windows sem instalar nada, mas e quebrado desde os anos 90 e
// nao entra aqui de jeito nenhum.
//
// a biblioteca e carregada so na hora de usar: ela sozinha pesa mais que
// todo o resto do site, e quem so lacra em .cgph nunca precisa dela
const carregarZip = () => import('@zip.js/zip.js')

export const zipWithPassword = async (
  file: File,
  password: string,
  onProgress: (value: number) => void
): Promise<Blob> => {
  const { BlobReader, BlobWriter, ZipWriter } = await carregarZip()
  onProgress(0.05)

  const writer = new ZipWriter(new BlobWriter('application/zip'), {
    password,
    encryptionStrength: 3,
    zipCrypto: false
  })

  await writer.add(file.name, new BlobReader(file), {
    onprogress: async (feito, total) => {
      onProgress(0.05 + (total ? feito / total : 0) * 0.9)
    }
  })

  const blob = await writer.close()
  onProgress(1)

  return blob
}

export const unzipWithPassword = async (
  file: File,
  password: string,
  onProgress: (value: number) => void
): Promise<{ blob: Blob; name: string }> => {
  const { BlobReader, BlobWriter, ZipReader } = await carregarZip()
  onProgress(0.1)

  const reader = new ZipReader(new BlobReader(file), { password })

  let entries: Awaited<ReturnType<typeof reader.getEntries>>

  try {
    entries = await reader.getEntries()
  } catch {
    throw new CryptoError('not-our-file')
  }

  const first = entries.find((entry) => !entry.directory)
  if (!first?.getData) throw new CryptoError('corrupted')

  onProgress(0.3)

  try {
    const blob = await first.getData(new BlobWriter(), {
      onprogress: async (feito, total) => {
        onProgress(0.3 + (total ? feito / total : 0) * 0.7)
      }
    })

    await reader.close()
    onProgress(1)

    return { blob, name: first.filename }
  } catch {
    // senha errada e arquivo corrompido chegam pelo mesmo caminho aqui
    throw new CryptoError('wrong-password')
  }
}
