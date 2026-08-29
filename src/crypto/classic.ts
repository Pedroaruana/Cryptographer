// cifras antigas, as que dava pra fazer no papel antes de existir computador.
// nenhuma delas protege nada hoje em dia, e o site diz isso na cara. estao
// aqui porque sao o comeco da historia e porque e divertido ver funcionando

export type MethodId =
  | 'aes'
  | 'argon'
  | 'caesar'
  | 'rot13'
  | 'atbash'
  | 'vigenere'
  | 'xor'
  | 'base64'
  | 'morse'
  | 'a1z26'
  | 'railfence'
  | 'polybius'
  | 'binary'
  | 'hex'
  | 'playfair'
  | 'bacon'
  | 'affine'
  | 'scytale'
  | 'rot47'
  | 'base32'
  | 'ascii'
  | 'nato'
  | 'tap'
  | 'braille'

const A = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

const shiftLetter = (char: string, by: number) => {
  const upper = char.toUpperCase()
  const at = A.indexOf(upper)
  if (at < 0) return char

  const moved = A[(((at + by) % 26) + 26) % 26]

  return char === upper ? moved : moved.toLowerCase()
}

// a chave vira numero somando os codigos das letras. assim qualquer senha
// serve de deslocamento sem a pessoa precisar digitar um numero
const keyToShift = (key: string) => {
  const asNumber = Number.parseInt(key, 10)
  if (Number.isFinite(asNumber) && key.trim() !== '') return asNumber

  return [...key].reduce((total, char) => total + char.charCodeAt(0), 0) || 3
}

const caesar = (text: string, key: string, back: boolean) => {
  const by = keyToShift(key) * (back ? -1 : 1)
  return [...text].map((char) => shiftLetter(char, by)).join('')
}

const rot13 = (text: string) => [...text].map((char) => shiftLetter(char, 13)).join('')

// atbash troca A por Z, B por Y e assim vai. e o mesmo dos dois lados
const atbash = (text: string) =>
  [...text]
    .map((char) => {
      const upper = char.toUpperCase()
      const at = A.indexOf(upper)
      if (at < 0) return char

      const flipped = A[25 - at]
      return char === upper ? flipped : flipped.toLowerCase()
    })
    .join('')

// vigenere e um cesar que muda de deslocamento a cada letra, seguindo a chave
const vigenere = (text: string, key: string, back: boolean) => {
  const letters = key.toUpperCase().replace(/[^A-Z]/g, '') || 'CHAVE'
  let at = 0

  return [...text]
    .map((char) => {
      if (!/[a-zA-Z]/.test(char)) return char

      const by = A.indexOf(letters[at % letters.length]) * (back ? -1 : 1)
      at++

      return shiftLetter(char, by)
    })
    .join('')
}

const toBase64 = (bytes: Uint8Array) => {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 8192) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 8192))
  }
  return btoa(binary)
}

const fromBase64 = (value: string) => {
  const binary = atob(value.replace(/\s+/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

const enc = new TextEncoder()
const dec = new TextDecoder()

// xor byte a byte com a chave repetida. saida em base64 senao vira caractere
// invisivel que ninguem consegue copiar
const xor = (bytes: Uint8Array, key: string) => {
  const keyBytes = enc.encode(key || 'chave')
  const out = new Uint8Array(bytes.length)

  for (let i = 0; i < bytes.length; i++) out[i] = bytes[i] ^ keyBytes[i % keyBytes.length]

  return out
}

const MORSE: Record<string, string> = {
  A: '.-',
  B: '-...',
  C: '-.-.',
  D: '-..',
  E: '.',
  F: '..-.',
  G: '--.',
  H: '....',
  I: '..',
  J: '.---',
  K: '-.-',
  L: '.-..',
  M: '--',
  N: '-.',
  O: '---',
  P: '.--.',
  Q: '--.-',
  R: '.-.',
  S: '...',
  T: '-',
  U: '..-',
  V: '...-',
  W: '.--',
  X: '-..-',
  Y: '-.--',
  Z: '--..',
  '0': '-----',
  '1': '.----',
  '2': '..---',
  '3': '...--',
  '4': '....-',
  '5': '.....',
  '6': '-....',
  '7': '--...',
  '8': '---..',
  '9': '----.',
  '.': '.-.-.-',
  ',': '--..--',
  '?': '..--..',
  '!': '-.-.--',
  '/': '-..-.',
  '-': '-....-'
}

const FROM_MORSE = Object.fromEntries(Object.entries(MORSE).map(([k, v]) => [v, k]))

const toMorse = (text: string) =>
  text
    .toUpperCase()
    .split(' ')
    .map((word) =>
      [...word]
        .map((char) => MORSE[char] ?? '')
        .filter(Boolean)
        .join(' ')
    )
    .join(' / ')

const fromMorse = (text: string) =>
  text
    .trim()
    .split('/')
    .map((word) =>
      word
        .trim()
        .split(/\s+/)
        .map((code) => FROM_MORSE[code] ?? '')
        .join('')
    )
    .join(' ')

// cada letra vira a posicao dela no alfabeto. brincadeira de crianca, mas e
// a base de qualquer cifra que faz conta com letra
const a1z26 = (text: string, back: boolean) => {
  if (back) {
    return text
      .trim()
      .split(/\s+/)
      .map((piece) => {
        const at = Number.parseInt(piece, 10)
        return Number.isFinite(at) && at >= 1 && at <= 26 ? A[at - 1] : ' '
      })
      .join('')
  }

  return [...text.toUpperCase()]
    .map((char) => {
      const at = A.indexOf(char)
      return at < 0 ? (char === ' ' ? '/' : '') : String(at + 1)
    })
    .filter(Boolean)
    .join(' ')
}

// zigue-zague: escreve a mensagem descendo e subindo entre tres linhas e
// depois le linha por linha
const railFence = (text: string, back: boolean, rails = 3) => {
  const clean = text.replace(/\s+/g, '')
  if (clean.length === 0) return ''

  const pattern: number[] = []
  let row = 0
  let way = 1

  for (let i = 0; i < clean.length; i++) {
    pattern.push(row)
    if (row === 0) way = 1
    else if (row === rails - 1) way = -1
    row += way
  }

  if (!back) {
    return Array.from({ length: rails }, (_, line) =>
      clean
        .split('')
        .filter((_, index) => pattern[index] === line)
        .join('')
    ).join('')
  }

  const out = new Array<string>(clean.length)
  let at = 0

  for (let line = 0; line < rails; line++) {
    for (let index = 0; index < clean.length; index++) {
      if (pattern[index] === line) out[index] = clean[at++]
    }
  }

  return out.join('')
}

// tabuleiro de 5 por 5 dos gregos. cada letra vira o par linha coluna.
// o I e o J dividem a mesma casa porque 26 nao cabe em 25
const POLYBIUS = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'

const polybius = (text: string, back: boolean) => {
  if (back) {
    return (text.match(/\d\d/g) ?? [])
      .map((pair) => POLYBIUS[(Number(pair[0]) - 1) * 5 + (Number(pair[1]) - 1)] ?? '')
      .join('')
  }

  return [...text.toUpperCase().replace(/J/g, 'I')]
    .map((char) => {
      const at = POLYBIUS.indexOf(char)
      if (at < 0) return char === ' ' ? ' ' : ''
      return `${Math.floor(at / 5) + 1}${(at % 5) + 1}`
    })
    .filter(Boolean)
    .join(' ')
}

const toBinary = (text: string) =>
  [...enc.encode(text)].map((byte) => byte.toString(2).padStart(8, '0')).join(' ')

const fromBinary = (text: string) =>
  dec.decode(
    Uint8Array.from((text.match(/[01]{8}/g) ?? []).map((piece) => Number.parseInt(piece, 2)))
  )

const toHex = (text: string) =>
  [...enc.encode(text)].map((byte) => byte.toString(16).padStart(2, '0')).join(' ')

const fromHex = (text: string) =>
  dec.decode(
    Uint8Array.from(
      (text.match(/[0-9a-fA-F]{2}/g) ?? []).map((piece) => Number.parseInt(piece, 16))
    )
  )

// Playfair trabalha com par de letras em vez de letra sozinha, que foi a
// grande sacada de 1854. a chave monta o tabuleiro de 5 por 5
const playfairSquare = (key: string) => {
  const square: string[] = []
  const source =
    key
      .toUpperCase()
      .replace(/[^A-Z]/g, '')
      .replace(/J/g, 'I') + POLYBIUS

  for (const char of source) if (!square.includes(char)) square.push(char)

  return square
}

const playfair = (text: string, key: string, back: boolean) => {
  const square = playfairSquare(key || 'CHAVE')
  const way = back ? -1 : 1
  const clean = text
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
    .replace(/J/g, 'I')
  const pairs: string[][] = []

  for (let i = 0; i < clean.length; ) {
    const first = clean[i]
    const second = clean[i + 1]

    // letra repetida no par quebra a regra, entao entra um X no meio
    if (!second || first === second) {
      pairs.push([first, 'X'])
      i += 1
    } else {
      pairs.push([first, second])
      i += 2
    }
  }

  return pairs
    .map(([a, b]) => {
      const ai = square.indexOf(a)
      const bi = square.indexOf(b)
      const ar = Math.floor(ai / 5)
      const ac = ai % 5
      const br = Math.floor(bi / 5)
      const bc = bi % 5

      if (ar === br) {
        return square[ar * 5 + ((ac + way + 5) % 5)] + square[br * 5 + ((bc + way + 5) % 5)]
      }

      if (ac === bc) {
        return square[((ar + way + 5) % 5) * 5 + ac] + square[((br + way + 5) % 5) * 5 + bc]
      }

      return square[ar * 5 + bc] + square[br * 5 + ac]
    })
    .join(' ')
}

// Bacon escondia a mensagem na propria tipografia: letra reta era A, letra
// inclinada era B. cinco marcas por letra
const bacon = (text: string, back: boolean) => {
  if (back) {
    return (
      text
        .toUpperCase()
        .replace(/[^AB]/g, '')
        .match(/[AB]{5}/g) ?? []
    )
      .map((group) => A[Number.parseInt(group.replace(/A/g, '0').replace(/B/g, '1'), 2)] ?? '')
      .join('')
  }

  return [...text.toUpperCase()]
    .map((char) => {
      const at = A.indexOf(char)
      if (at < 0) return char === ' ' ? '/' : ''

      return at.toString(2).padStart(5, '0').replace(/0/g, 'A').replace(/1/g, 'B')
    })
    .filter(Boolean)
    .join(' ')
}

// afim: multiplica e depois soma. o multiplicador precisa nao ter fator
// comum com 26, senao duas letras diferentes caem na mesma e nao volta
const AFFINE_A = [3, 5, 7, 11, 15, 17, 19, 21, 23, 25]

const modInverse = (value: number) => {
  for (let i = 1; i < 26; i++) if ((value * i) % 26 === 1) return i
  return 1
}

const affine = (text: string, key: string, back: boolean) => {
  const sum = keyToShift(key)
  const a = AFFINE_A[Math.abs(sum) % AFFINE_A.length]
  const b = Math.abs(sum) % 26
  const inverse = modInverse(a)

  return [...text]
    .map((char) => {
      const upper = char.toUpperCase()
      const at = A.indexOf(upper)
      if (at < 0) return char

      const moved = back ? A[(inverse * ((at - b + 26) % 26)) % 26] : A[(a * at + b) % 26]

      return char === upper ? moved : moved.toLowerCase()
    })
    .join('')
}

// citala espartana: enrola a tira de couro num bastao, escreve na horizontal
// e desenrola. sem um bastao da mesma grossura vira letra solta
const scytale = (text: string, back: boolean, columns = 5) => {
  const clean = text.replace(/\s+/g, '')
  if (!clean) return ''

  const rows = Math.ceil(clean.length / columns)

  if (!back) {
    let out = ''
    for (let column = 0; column < columns; column++) {
      for (let row = 0; row < rows; row++) {
        const at = row * columns + column
        if (clean[at]) out += clean[at]
      }
    }
    return out
  }

  const out = new Array<string>(clean.length)
  let at = 0

  for (let column = 0; column < columns; column++) {
    for (let row = 0; row < rows; row++) {
      const index = row * columns + column
      if (index < clean.length) out[index] = clean[at++]
    }
  }

  return out.join('')
}

// rot47 e o rot13 dos programadores: pega toda a faixa visivel do ASCII,
// numero e simbolo junto, e anda 47 casas
const rot47 = (text: string) =>
  [...text]
    .map((char) => {
      const code = char.charCodeAt(0)
      if (code < 33 || code > 126) return char
      return String.fromCharCode(((code - 33 + 47) % 94) + 33)
    })
    .join('')

const B32 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

const toBase32 = (bytes: Uint8Array) => {
  let bits = 0
  let value = 0
  let out = ''

  for (const byte of bytes) {
    value = (value << 8) | byte
    bits += 8

    while (bits >= 5) {
      out += B32[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) out += B32[(value << (5 - bits)) & 31]
  while (out.length % 8 !== 0) out += '='

  return out
}

const fromBase32 = (text: string) => {
  const clean = text.toUpperCase().replace(/[^A-Z2-7]/g, '')
  const out: number[] = []
  let bits = 0
  let value = 0

  for (const char of clean) {
    value = (value << 5) | B32.indexOf(char)
    bits += 5

    if (bits >= 8) {
      out.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return new Uint8Array(out)
}

const NATO = [
  'Alfa',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Golf',
  'Hotel',
  'India',
  'Juliett',
  'Kilo',
  'Lima',
  'Mike',
  'November',
  'Oscar',
  'Papa',
  'Quebec',
  'Romeo',
  'Sierra',
  'Tango',
  'Uniform',
  'Victor',
  'Whiskey',
  'Xray',
  'Yankee',
  'Zulu'
]

const nato = (text: string, back: boolean) => {
  if (back) {
    return text
      .trim()
      .split(/\s+/)
      .map((word) => {
        const at = NATO.findIndex((name) => name.toLowerCase() === word.toLowerCase())
        return at < 0 ? (word === '/' ? ' ' : '') : A[at]
      })
      .join('')
  }

  return [...text.toUpperCase()]
    .map((char) => {
      const at = A.indexOf(char)
      return at < 0 ? (char === ' ' ? '/' : '') : NATO[at]
    })
    .filter(Boolean)
    .join(' ')
}

// codigo de batida, o que os prisioneiros usavam na parede. numero de
// batidas da linha, pausa, numero de batidas da coluna
const tapCode = (text: string, back: boolean) => {
  if (back) {
    return (text.match(/\.+\s+\.+/g) ?? [])
      .map((pair) => {
        const [row, column] = pair.split(/\s+/)
        return POLYBIUS[(row.length - 1) * 5 + (column.length - 1)] ?? ''
      })
      .join('')
  }

  return [...text.toUpperCase().replace(/J/g, 'I')]
    .map((char) => {
      const at = POLYBIUS.indexOf(char)
      if (at < 0) return char === ' ' ? '/' : ''

      return `${'.'.repeat(Math.floor(at / 5) + 1)} ${'.'.repeat((at % 5) + 1)}`
    })
    .filter(Boolean)
    .join('   ')
}

const BRAILLE = '⠁⠃⠉⠙⠑⠋⠛⠓⠊⠚⠅⠇⠍⠝⠕⠏⠟⠗⠎⠞⠥⠧⠺⠭⠽⠵'

const braille = (text: string, back: boolean) => {
  if (back) {
    return [...text]
      .map((char) => {
        const at = BRAILLE.indexOf(char)
        return at < 0 ? (char === '⠀' || char === ' ' ? ' ' : '') : A[at]
      })
      .join('')
  }

  return [...text.toUpperCase()]
    .map((char) => {
      const at = A.indexOf(char)
      return at < 0 ? (char === ' ' ? ' ' : '') : BRAILLE[at]
    })
    .join('')
}

// quais precisam de chave. as que nao precisam a tela esconde o campo de senha
export const NEEDS_KEY: Record<MethodId, boolean> = {
  aes: true,
  argon: true,
  caesar: true,
  rot13: false,
  atbash: false,
  vigenere: true,
  xor: true,
  base64: false,
  morse: false,
  a1z26: false,
  railfence: false,
  polybius: false,
  binary: false,
  hex: false,
  playfair: true,
  bacon: false,
  affine: true,
  scytale: false,
  rot47: false,
  base32: false,
  ascii: false,
  nato: false,
  tap: false,
  braille: false
}

export const CLASSIC_IDS: MethodId[] = [
  'caesar',
  'vigenere',
  'playfair',
  'affine',
  'xor',
  'atbash',
  'rot13',
  'rot47',
  'railfence',
  'scytale',
  'polybius',
  'tap',
  'bacon',
  'a1z26',
  'morse',
  'nato',
  'braille',
  'binary',
  'hex',
  'ascii',
  'base32',
  'base64'
]

export const applyClassic = (id: MethodId, text: string, key: string, back: boolean): string => {
  if (id === 'caesar') return caesar(text, key, back)
  if (id === 'rot13') return rot13(text)
  if (id === 'atbash') return atbash(text)
  if (id === 'vigenere') return vigenere(text, key, back)
  if (id === 'xor')
    return back ? dec.decode(xor(fromBase64(text), key)) : toBase64(xor(enc.encode(text), key))
  if (id === 'base64') return back ? dec.decode(fromBase64(text)) : toBase64(enc.encode(text))
  if (id === 'morse') return back ? fromMorse(text) : toMorse(text)
  if (id === 'a1z26') return a1z26(text, back)
  if (id === 'railfence') return railFence(text, back)
  if (id === 'polybius') return polybius(text, back)
  if (id === 'binary') return back ? fromBinary(text) : toBinary(text)
  if (id === 'hex') return back ? fromHex(text) : toHex(text)
  if (id === 'playfair') return playfair(text, key, back)
  if (id === 'bacon') return bacon(text, back)
  if (id === 'affine') return affine(text, key, back)
  if (id === 'scytale') return scytale(text, back)
  if (id === 'rot47') return rot47(text)
  if (id === 'base32') return back ? dec.decode(fromBase32(text)) : toBase32(enc.encode(text))
  if (id === 'nato') return nato(text, back)
  if (id === 'tap') return tapCode(text, back)
  if (id === 'braille') return braille(text, back)

  if (id === 'ascii') {
    return back
      ? dec.decode(Uint8Array.from((text.match(/\d+/g) ?? []).map(Number)))
      : [...enc.encode(text)].join(' ')
  }

  return text
}
