// formato do arquivo que a gente gera. escrevi isso primeiro pq se eu mudar
// depois sem versao, todo arquivo que ja saiu do site vira lixo e ninguem
// consegue mais abrir. o byte de versao existe justamente pra isso

export const MAGIC = [0x43, 0x47, 0x50, 0x48] // "CGPH"
export const VERSION = 1
export const ALGO_AES_GCM = 1
export const ALGO_AES_GCM_ARGON2 = 2

// parametros do Argon2id. ficam fixos no codigo em vez de irem no cabecalho
// pra nao ter que mudar o formato do arquivo e quebrar os antigos.
// 64 MB e o que a OWASP recomenda, e e justamente a memoria que torna
// ataque com placa de video caro
export const ARGON_MEMORY_KB = 64 * 1024
export const ARGON_PARALLELISM = 1
export const ARGON_TIME = 3

// numero recomendado pela OWASP pra PBKDF2 com SHA-256
export const KDF_ITERATIONS = 310_000

export const SALT_BYTES = 16
export const IV_BYTES = 12
export const HEADER_BYTES = 30
export const CHUNK_BYTES = 4 * 1024 * 1024

export const EXTENSION = '.cgph'

// limite pra nao explodir a memoria do navegador. quando eu fizer o modo
// streaming de verdade da pra subir bem mais
export const MAX_FILE_BYTES = 512 * 1024 * 1024

export const TEXT_HEADER = '-----BEGIN CRYPTOGRAPHER MESSAGE-----'
export const TEXT_FOOTER = '-----END CRYPTOGRAPHER MESSAGE-----'

export const PUB_HEADER = '-----BEGIN CRYPTOGRAPHER PUBLIC KEY-----'
export const PUB_FOOTER = '-----END CRYPTOGRAPHER PUBLIC KEY-----'

export const PRIV_HEADER = '-----BEGIN CRYPTOGRAPHER PRIVATE KEY-----'
export const PRIV_FOOTER = '-----END CRYPTOGRAPHER PRIVATE KEY-----'

export const SIGN_HEADER = '-----BEGIN CRYPTOGRAPHER SIGNATURE-----'
export const SIGN_FOOTER = '-----END CRYPTOGRAPHER SIGNATURE-----'

export const PART_HEADER = '-----BEGIN CRYPTOGRAPHER SHARE-----'
export const PART_FOOTER = '-----END CRYPTOGRAPHER SHARE-----'

// container do arquivo trancado com a chave publica de alguem. e um formato
// separado do .cgph de proposito: la o cabecalho guarda sal e iteracoes, aqui
// guarda a chave efemera, e misturar os dois so ia deixar os dois confusos
export const PK_MAGIC = [0x43, 0x47, 0x50, 0x4b] // "CGPK"
export const PK_VERSION = 1
export const PK_EXTENSION = '.cgpk'
export const CURVE = 'P-256'

export type CryptoErrorCode =
  | 'wrong-password'
  | 'not-our-file'
  | 'bad-version'
  | 'file-too-big'
  | 'corrupted'
  | 'image-too-small'
  | 'nothing-hidden'
  | 'needs-password'
  | 'bad-key'
  | 'not-for-you'
  | 'few-parts'
  | 'mixed-parts'
  | 'unknown'

export class CryptoError extends Error {
  code: CryptoErrorCode

  constructor(code: CryptoErrorCode) {
    super(code)
    this.code = code
  }
}

export type FileMeta = {
  name: string
  type: string
  size: number
}
