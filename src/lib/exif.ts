// leitor de metadados. isso NAO e esteganografia: aqui nada foi escondido
// por ninguem. a camera grava esses dados no proprio arquivo, abertos, e a
// maioria das pessoas nao faz ideia de que eles existem.
//
// o que mais assusta e o GPS: uma foto tirada em casa carrega a coordenada
// de onde a pessoa mora, e ela vai junto quando a foto e enviada

export type Achado = {
  chave: string
  valor: string
  sensivel?: boolean
}

export type Metadados = {
  achados: Achado[]
  coordenadas: { lat: number; lon: number } | null
  temExif: boolean
}

const TIPOS: Record<number, number> = { 1: 1, 2: 1, 3: 2, 4: 4, 5: 8, 7: 1, 9: 4, 10: 8 }

const TAGS_BASE: Record<number, string> = {
  271: 'Fabricante',
  272: 'Modelo',
  274: 'Orientação',
  305: 'Programa',
  306: 'Data do arquivo'
}

const TAGS_EXIF: Record<number, string> = {
  33434: 'Tempo de exposição',
  34855: 'ISO',
  36867: 'Data da foto',
  37386: 'Distância focal',
  40962: 'Largura',
  40963: 'Altura'
}

const GRAUS = [0x0002, 0x0004]

// percorre uma IFD, que e a tabela de tags do formato TIFF usada pelo EXIF
const lerIFD = (
  view: DataView,
  inicioTiff: number,
  offsetIFD: number,
  little: boolean
): Map<number, unknown> => {
  const saida = new Map<number, unknown>()
  const base = inicioTiff + offsetIFD

  if (base + 2 > view.byteLength) return saida

  const quantas = view.getUint16(base, little)

  for (let i = 0; i < quantas; i++) {
    const at = base + 2 + i * 12
    if (at + 12 > view.byteLength) break

    const tag = view.getUint16(at, little)
    const tipo = view.getUint16(at + 2, little)
    const quantidade = view.getUint32(at + 4, little)
    const tamanho = (TIPOS[tipo] ?? 0) * quantidade

    if (!tamanho) continue

    const posicao = tamanho <= 4 ? at + 8 : inicioTiff + view.getUint32(at + 8, little)
    if (posicao + tamanho > view.byteLength) continue

    if (tipo === 2) {
      let texto = ''
      for (let j = 0; j < quantidade; j++) {
        const byte = view.getUint8(posicao + j)
        if (byte === 0) break
        texto += String.fromCharCode(byte)
      }
      saida.set(tag, texto.trim())
      continue
    }

    if (tipo === 5 || tipo === 10) {
      const racionais: number[] = []
      for (let j = 0; j < quantidade; j++) {
        const cima = view.getUint32(posicao + j * 8, little)
        const baixo = view.getUint32(posicao + j * 8 + 4, little)
        racionais.push(baixo === 0 ? 0 : cima / baixo)
      }
      saida.set(tag, quantidade === 1 ? racionais[0] : racionais)
      continue
    }

    if (tipo === 3) saida.set(tag, view.getUint16(posicao, little))
    else if (tipo === 4 || tipo === 9) saida.set(tag, view.getUint32(posicao, little))
  }

  return saida
}

// grau, minuto e segundo viram um numero so
const paraDecimal = (partes: number[], referencia: string) => {
  const [grau = 0, minuto = 0, segundo = 0] = partes
  const valor = grau + minuto / 60 + segundo / 3600

  return referencia === 'S' || referencia === 'W' ? -valor : valor
}

export const lerExifDeJpeg = (bytes: Uint8Array): Metadados => {
  const vazio: Metadados = { achados: [], coordenadas: null, temExif: false }

  if (bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return vazio

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  let at = 2

  // procura o segmento APP1, que e onde o EXIF mora
  while (at + 4 <= bytes.length) {
    if (view.getUint8(at) !== 0xff) break

    const marcador = view.getUint8(at + 1)
    if (marcador === 0xd8 || marcador === 0x01 || (marcador >= 0xd0 && marcador <= 0xd7)) {
      at += 2
      continue
    }

    const tamanho = view.getUint16(at + 2, false)

    if (marcador === 0xe1) {
      const inicio = at + 4
      const assinatura = String.fromCharCode(...bytes.slice(inicio, inicio + 4))

      if (assinatura === 'Exif') {
        const tiff = inicio + 6
        if (tiff + 8 > bytes.length) return vazio

        const ordem = view.getUint16(tiff, false)
        const little = ordem === 0x4949
        const primeiraIFD = view.getUint32(tiff + 4, little)

        const base = lerIFD(view, tiff, primeiraIFD, little)
        const achados: Achado[] = []

        for (const [tag, nome] of Object.entries(TAGS_BASE)) {
          const valor = base.get(Number(tag))
          if (valor !== undefined && valor !== '')
            achados.push({ chave: nome, valor: String(valor) })
        }

        const ponteiroExif = base.get(0x8769)
        if (typeof ponteiroExif === 'number') {
          const exif = lerIFD(view, tiff, ponteiroExif, little)
          for (const [tag, nome] of Object.entries(TAGS_EXIF)) {
            const valor = exif.get(Number(tag))
            if (valor !== undefined && valor !== '') {
              achados.push({ chave: nome, valor: String(valor), sensivel: nome.startsWith('Data') })
            }
          }
        }

        let coordenadas: Metadados['coordenadas'] = null
        const ponteiroGps = base.get(0x8825)

        if (typeof ponteiroGps === 'number') {
          const gps = lerIFD(view, tiff, ponteiroGps, little)
          const lat = gps.get(GRAUS[0])
          const lon = gps.get(GRAUS[1])

          if (Array.isArray(lat) && Array.isArray(lon)) {
            coordenadas = {
              lat: paraDecimal(lat as number[], String(gps.get(0x0001) ?? 'N')),
              lon: paraDecimal(lon as number[], String(gps.get(0x0003) ?? 'E'))
            }
          }
        }

        return { achados, coordenadas, temExif: achados.length > 0 || coordenadas !== null }
      }
    }

    at += 2 + tamanho
  }

  return vazio
}

// PNG guarda texto em pedacos tEXt, que e bem mais simples que o EXIF
export const lerTextoDePng = (bytes: Uint8Array): Metadados => {
  const assinatura = [0x89, 0x50, 0x4e, 0x47]
  if (!assinatura.every((b, i) => bytes[i] === b)) {
    return { achados: [], coordenadas: null, temExif: false }
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
  const achados: Achado[] = []
  let at = 8

  while (at + 8 <= bytes.length) {
    const tamanho = view.getUint32(at, false)
    const tipo = String.fromCharCode(...bytes.slice(at + 4, at + 8))

    if (tipo === 'tEXt' && at + 8 + tamanho <= bytes.length) {
      const bruto = bytes.slice(at + 8, at + 8 + tamanho)
      const corte = bruto.indexOf(0)

      if (corte > 0) {
        achados.push({
          chave: new TextDecoder().decode(bruto.slice(0, corte)),
          valor: new TextDecoder().decode(bruto.slice(corte + 1)).slice(0, 120)
        })
      }
    }

    if (tipo === 'IEND') break
    at += 12 + tamanho
  }

  return { achados, coordenadas: null, temExif: achados.length > 0 }
}

export const lerMetadados = async (file: Blob): Promise<Metadados> => {
  const bytes = new Uint8Array(await file.arrayBuffer())

  const doJpeg = lerExifDeJpeg(bytes)
  if (doJpeg.temExif) return doJpeg

  return lerTextoDePng(bytes)
}

// redesenhar a imagem num canvas descarta tudo que nao for pixel. e o jeito
// mais confiavel de limpar, porque nao depende de eu conhecer todo campo
// que possa existir no arquivo
export const limparMetadados = async (file: Blob): Promise<Blob> => {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height

  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('sem canvas')

  ctx.drawImage(bitmap, 0, 0)
  bitmap.close()

  const tipo = file.type === 'image/png' ? 'image/png' : 'image/jpeg'

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('nao consegui gerar a imagem'))),
      tipo,
      tipo === 'image/jpeg' ? 0.92 : undefined
    )
  })
}
