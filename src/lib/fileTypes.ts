// o atributo accept aceita tres formas misturadas na mesma lista:
// extensao (".cgph"), tipo exato ("image/png") e curinga ("image/*").
// a validacao antiga so sabia comparar extensao, entao lista de tipo MIME
// recusava tudo

export const matchesAccept = (file: { name: string; type: string }, accept?: string) => {
  if (!accept) return true

  const nome = file.name.toLowerCase()
  const tipo = file.type.toLowerCase()

  return accept
    .split(',')
    .map((parte) => parte.trim().toLowerCase())
    .filter(Boolean)
    .some((parte) => {
      if (parte.startsWith('.')) return nome.endsWith(parte)

      if (parte.endsWith('/*')) {
        const familia = parte.slice(0, -1)
        return tipo.startsWith(familia)
      }

      return tipo === parte
    })
}
