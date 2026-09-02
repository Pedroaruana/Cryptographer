# Segurança

Este é um site de criptografia. Uma falha aqui é mais séria do que numa lista de
tarefas, então trato relato de problema com prioridade sobre qualquer coisa nova.

## Como relatar

Use o **[Report a vulnerability](https://github.com/Pedroaruana/Cryptographer/security/advisories/new)**,
na aba Security do repositório. É privado, só eu vejo.

Não abra issue pública pra falha de segurança. Issue é pública desde o segundo
em que você aperta o botão.

Respondo em até 7 dias. Se for real, conserto e digo o que era.

## O que interessa

- Qualquer caminho em que um arquivo, uma senha ou um texto saia do navegador
- Erro na derivação de chave, no uso do AES-256-GCM ou no formato `.cgph`
- Um arquivo lacrado que abra com a senha errada, ou que não abra com a certa
- Segredo escondido numa foto que apareça legível pra quem não tem a senha
- Furo na política de segurança da página, o CSP
- Vazamento de senha em memória, em log, na URL ou no histórico do navegador

## O que já é conhecido, e não é falha

- **As cifras clássicas não protegem nada.** César, Vigenère, Playfair e as
  outras estão ali pra ensinar como criptografia funcionava, e o próprio site
  avisa isso em cima de cada uma. Não relate que dá pra quebrar. Dá mesmo
- **Senha perdida é arquivo perdido.** Não existe recuperação e isso é de
  propósito. Se existisse, existiria uma porta
- **Sem senha, a esteganografia não esconde de quem sabe procurar.** O segredo
  entra como texto puro nos bits das cores. Quem desconfiar e souber olhar, acha.
  É por isso que dá pra colocar senha, e é por isso que o site explica a
  diferença antes de você escolher
- **Quem já está dentro da sua máquina já ganhou.** Extensão maliciosa e
  keylogger estão fora do que este site consegue impedir

## O que roda aqui

Nada de criptografia caseira. A parte que embaralha byte é a Web Crypto API do
próprio navegador. Argon2id vem do `hash-wasm`, e o ZIP com senha do
`@zip.js/zip.js`.

Não existe servidor, banco de dados nem conta. O site é arquivo estático, e a
política de segurança declara `connect-src 'self'`, então o navegador bloqueia
qualquer envio pra fora antes que ele aconteça.
