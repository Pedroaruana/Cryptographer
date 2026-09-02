import type { Dict } from './en'

export const pt: Dict = {
  nav: {
    encrypt: 'Criptografar',
    decrypt: 'Descriptografar',
    hash: 'Impressão digital',
    how: 'Como funciona',
    navHide: 'Esconder',
    navMeta: 'Metadados',
    menu: 'Menu',
    skip: 'Pular para o conteúdo'
  },

  hash: {
    eyebrow: 'Impressão digital',
    title: 'Prove que nada mudou.',
    lead: 'Hash é rua de mão única. Transforma qualquer arquivo numa impressão digital curta, e o mesmo arquivo sempre dá a mesma. Muda um bit e a impressão muda inteira. Não esconde nada, prova que ninguém encostou.',
    tabFile: 'Arquivo',
    tabText: 'Texto',
    drop: 'Solta um arquivo aqui',
    dropHint: 'ou clica pra escolher',
    textPlaceholder: 'Digita ou cola qualquer coisa...',
    algo: 'Algoritmo',
    action: 'Tirar a impressão',
    working: 'Lendo...',
    done: 'Impressão tirada.',
    copy: 'Copiar',
    copied: 'Copiado',
    again: 'Fazer outro',
    verify: 'Comparar com uma impressão conhecida',
    verifyPlaceholder: 'cola aqui o hash esperado',
    match: 'Bateu. O arquivo é exatamente o que você esperava.',
    noMatch: 'Não bateu. Esse não é o mesmo arquivo.',
    note: 'Isso não é criptografia. Hash não tem volta, então não existe jeito de recuperar o arquivo a partir dele.'
  },

  hide: {
    eyebrow: 'Esconder',
    title: 'Põe um segredo dentro de uma foto.',
    lead: 'Isso é o contrário de trancar o arquivo. A foto, ou o áudio, volta com a mesma cara e abre normal em qualquer programa, só que carregando o seu segredo dentro dos pixels ou das amostras de som. Só quem tem a senha consegue tirar de lá.',
    tabHide: 'Esconder',
    tabReveal: 'Tirar de lá',
    drop: 'Solta um PNG aqui',
    dropHint: 'ou clica pra escolher',
    formats: 'PNG, BMP, WebP ou WAV. Formato com perda, como JPEG e MP3, não serve',
    dropHintAudio: 'ou clica pra escolher',
    downloadAudio: 'Baixar o áudio',
    warnMp3:
      'MP3, AAC e áudio de WhatsApp também não servem, pelo mesmo motivo do JPEG: são formatos com perda. Só WAV, que guarda a onda amostra por amostra.',
    dropReveal: 'Solta a foto que carrega o segredo',
    secret: 'O segredo',
    secretPlaceholder: 'uma senha, um código, um recado...',
    action: 'Esconder na foto',
    actionReveal: 'Tirar o segredo de lá',
    working: 'Escondendo...',
    workingReveal: 'Procurando...',
    done: 'Escondido. A foto continua igual.',
    doneReveal: 'Achei.',
    download: 'Baixar a foto',
    copy: 'Copiar o segredo',
    copied: 'Copiado',
    again: 'Fazer outra',
    room: 'Essa foto comporta até {size} de segredo.',
    withPassword:
      'Com senha: o segredo é criptografado com AES-256 antes de entrar na foto. Mesmo quem desconfiar e extrair os bits só acha ruído sem a senha.',
    withoutPassword:
      'Sem senha: o segredo entra como texto puro. A foto continua parecendo normal, mas qualquer ferramenta de esteganografia lê o que está lá dentro. Serve pra recado, não pra segredo.',
    revealNote:
      'Deixa em branco e tenta assim mesmo. O próprio arquivo avisa se foi criptografado, e só aí a senha é pedida.',
    howTitle: 'Como funciona',
    howSteps: [
      'O seu segredo é criptografado com AES-256 antes de tudo, então tirar ele da foto não basta. Quem achar ainda precisa da senha.',
      'Depois cada bit entra no último bit de uma cor. Mudar o vermelho de 200 pra 201 é invisível pro olho, e cada pixel carrega três desses bits.',
      'A foto é salva de novo em PNG. Ela abre em qualquer visualizador, e nada nela parece estranho.'
    ],
    warnTitle: 'O que não vai funcionar',
    warnJpeg:
      'JPEG não serve, e isso não é limitação do site. A compressão do JPEG joga fora exatamente os bits que carregam o segredo, então ele seria destruído na hora de salvar. É por isso que o resultado sai sempre em PNG, mesmo que você coloque um JPEG.',
    warnEdit:
      'Não redimensiona, não corta, não aplica filtro e não salva a foto de novo em outro lugar. Qualquer uma dessas coisas apaga o segredo. Manda o arquivo exatamente como saiu daqui.',
    warnSocial:
      'WhatsApp, Instagram e quase toda rede social recomprimem toda imagem que recebem. A foto chega bonita, mas o segredo se foi. Pra mandar inteiro, anexa como documento ou arquivo.',
    warnAlpha:
      'As partes totalmente transparentes da imagem são puladas, porque o navegador pode mudar a cor delas ao salvar. Foto com muita transparência comporta menos.'
  },

  archive: {
    title: 'ZIP com senha',
    lead: 'Pra quando a pessoa do outro lado não vai entrar neste site. O arquivo volta como um ZIP que abre em qualquer computador, pedindo a senha.',
    note: 'Usa AES-256, que é o padrão forte do formato. Isso quer dizer que 7-Zip, WinRAR ou Keka abrem, mas o descompactador que já vem no Windows e no macOS não abre, porque eles só entendem a criptografia velha e quebrada dos anos 90, que não entra aqui.',
    pick: 'O que sai',
    cgph: 'arquivo .cgph',
    cgphNote: 'menor, só abre aqui',
    zip: 'arquivo .zip',
    zipNote: 'abre em qualquer lugar, precisa do 7-Zip'
  },

  meta: {
    eyebrow: 'Metadados',
    title: 'O que a sua foto conta sobre você.',
    lead: 'Isso não é esteganografia: ninguém escondeu nada aqui. A câmera grava esses dados dentro do arquivo, abertos, e a maioria das pessoas não sabe que eles existem. Solta uma foto e vê o que ela entrega.',
    drop: 'Solta uma foto aqui',
    dropHint: 'ou clica pra escolher',
    formats: 'JPEG para dados de câmera e GPS, PNG para texto de programa',
    reading: 'Lendo o arquivo...',
    nothing:
      'Essa foto não carrega metadado nenhum. Ou nunca teve, ou já foi limpa por algum programa ou rede social no caminho.',
    gpsTitle: 'Essa foto sabe onde você estava',
    gpsNote:
      'A câmera gravou a coordenada exata de onde a foto foi tirada. Se ela foi tirada em casa, isso é o seu endereço, e ele viaja junto toda vez que você envia o arquivo original.',
    gpsOpen: 'Ver esse ponto no mapa',
    gpsLinkNote:
      'Esse link abre o OpenStreetMap numa aba nova e envia a coordenada pra eles. Nada é enviado se você não clicar.',
    clean: 'Limpar os metadados',
    download: 'Baixar a foto limpa',
    cleanDone:
      'A foto foi redesenhada só com os pixels. Confere o resultado soltando a cópia limpa aqui de novo: não deve sobrar nada.',
    howTitle: 'Como funciona',
    howSteps: [
      'O arquivo é lido dentro do seu navegador, igual ao resto do site. Nenhuma foto sai daqui, e nesta tela isso importa mais que nas outras, porque o que está sendo lido é justamente o que você não quer entregar.',
      'Em JPEG os dados ficam num pedaço chamado EXIF, um formato próprio dentro do arquivo, com fabricante, modelo, data e, quando a localização está ligada, a coordenada de GPS.',
      'Limpar redesenha a imagem num canvas e salva de novo. Como só os pixels são copiados, tudo que não é pixel fica pra trás. É mais confiável que apagar campo por campo, porque não depende de eu conhecer todo campo que possa existir.'
    ],
    warnTitle: 'O que vale saber',
    warns: [
      'Instagram, Facebook e WhatsApp já removem metadados das fotos que publicam. O problema é o arquivo original, aquele que você manda por email, anexa num documento ou envia como arquivo em vez de imagem.',
      'Foto de celular com localização ligada quase sempre tem GPS. Vale testar com uma foto sua tirada em casa pra ver o que sai.',
      'Limpar recodifica a imagem, então um JPEG perde um pouco de qualidade nesse processo. PNG não perde nada.',
      'Metadado não é só privacidade. O campo de programa entrega qual editor foi usado, o que já rendeu identificação de montagem em foto que se dizia original.'
    ]
  },

  warn: 'Se perder a senha, o arquivo se perde junto. Aqui não existe recuperar senha, e ninguém consegue abrir pra você.',
  warnOk: 'Entendi',

  theme: { toDark: 'Apagar a luz', toLight: 'Acender a luz' },

  home: {
    eyebrow: 'Nada sai do seu navegador',
    titleA: 'Tranque um arquivo',
    titleB: 'como se tranca',
    titleC: 'uma gaveta.',
    lead: 'Cinco coisas, todas dentro do seu navegador. Trancar um arquivo pra ninguém abrir sem a senha. Esconder um segredo dentro de uma foto ou de um áudio que continuam parecendo os mesmos. Transformar um recado em algo ilegível. Ver o que a sua foto já entrega sem você saber. Ou tirar a impressão digital de um arquivo pra provar que ninguém encostou nele.',
    ctaPrimary: 'Lacrar alguma coisa',
    ctaSecondary: 'Abrir um arquivo lacrado',
    trust: 'Grátis · Sem conta · Sem upload · Funciona offline',

    lensToken: 'Senha=62527',
    stepsEyebrow: 'Como funciona',
    stepsTitle: 'Três passos e um lacre de cera.',
    steps: [
      {
        n: '01',
        title: 'Solta o arquivo aqui',
        text: 'Qualquer coisa até 512 MB. O navegador lê direto do seu disco e não manda pra lugar nenhum.'
      },
      {
        n: '02',
        title: 'Escreve uma senha',
        text: 'A sua senha vira a chave. A gente estica ela 310 mil vezes, o que faz testar senha em massa deixar de valer a pena.'
      },
      {
        n: '03',
        title: 'Leva a cópia lacrada',
        text: 'Você recebe um arquivo .cgph. O nome e o tipo originais viajam criptografados lá dentro, então o arquivo não entrega nada.'
      }
    ],

    guideOf: 'de',
    guidePrev: 'Página anterior',
    guideNext: 'Próxima página',

    guide: [
      {
        key: 'seal',
        to: '/encrypt',
        cta: 'Ir trancar um arquivo',
        tab: 'Trancar um arquivo',
        steps: [
          {
            n: '01',
            title: 'Solta o arquivo aqui',
            text: 'Qualquer coisa até 512 MB. O navegador lê direto do seu disco e não manda pra lugar nenhum.'
          },
          {
            n: '02',
            title: 'Escreve uma senha',
            text: 'A sua senha vira a chave. A gente estica ela 310 mil vezes, o que faz testar senha em massa deixar de valer a pena.'
          },
          {
            n: '03',
            title: 'Leva a cópia lacrada',
            text: 'Um arquivo .cgph que só abre aqui de volta, ou um .zip com senha que abre em qualquer computador. Você escolhe qual sai.'
          }
        ],
        panelTitle: 'O que tem dentro do .cgph',
        panelLead: 'Todo arquivo lacrado é montado assim. Byte por byte.',
        rows: [
          ['CGPH', '4 bytes', 'assinatura, pro site saber que o arquivo é nosso'],
          ['01', '1 byte', 'versão do formato, pra arquivo antigo continuar abrindo'],
          ['01', '1 byte', 'qual algoritmo lacrou'],
          ['310000', '4 bytes', 'quantas vezes a senha foi esticada'],
          ['sal', '16 bytes', 'aleatório, pra mesma senha nunca dar a mesma chave'],
          ['4 MB', '4 bytes', 'tamanho de cada bloco'],
          ['bloco 0', 'IV + dados', 'o nome e o tipo originais, criptografados'],
          ['bloco 1..n', 'IV + dados + etiqueta', 'o arquivo em si, cortado em pedaços e assinado']
        ],
        notes: []
      },
      {
        key: 'hide',
        to: '/esconder',
        cta: 'Ir esconder um segredo',
        tab: 'Esconder dentro de uma foto',
        steps: [
          {
            n: '01',
            title: 'Traz uma foto',
            text: 'Um PNG, um BMP ou um WebP. Tem que ser formato que guarda cada pixel exatamente como ele é.'
          },
          {
            n: '02',
            title: 'Escreve o segredo',
            text: 'Ele é criptografado com AES-256 antes de tudo, então achar ele na foto não basta. Quem achar ainda precisa da senha.'
          },
          {
            n: '03',
            title: 'Leva a mesma foto de volta',
            text: 'Ela fica idêntica, abre em qualquer visualizador, e carrega o segredo no último bit de cada cor. Três bits por pixel.'
          }
        ],
        panelTitle: 'Onde o segredo se perde',
        panelLead: 'O difícil não é esconder. É fazer chegar.',
        rows: [],
        notes: [
          'JPEG não serve. A compressão dele joga fora exatamente os bits que carregam o segredo, então ele seria destruído na hora de salvar. É por isso que o resultado sai sempre em PNG.',
          'Redimensionar, cortar, aplicar filtro ou salvar a foto de novo em outro lugar apaga tudo. Manda o arquivo exatamente como saiu daqui.',
          'WhatsApp e Instagram recomprimem toda imagem que recebem. A foto chega bonita e o segredo se foi. Anexa como documento no lugar disso.',
          'Uma foto de 1000 por 1000 comporta cerca de 375 KB. O site diz o espaço exato assim que você solta a foto.'
        ]
      },
      {
        key: 'meta',
        to: '/metadados',
        cta: 'Ir ver o que a foto entrega',
        tab: 'Ver o que a foto entrega',
        steps: [
          {
            n: '01',
            title: 'Solta uma foto qualquer',
            text: 'De preferência uma tirada pelo seu celular, sem ter passado por rede social. É nela que os dados ainda estão inteiros.'
          },
          {
            n: '02',
            title: 'Olha o que aparece',
            text: 'Marca e modelo do aparelho, data e hora exatas, o programa que editou, e a coordenada de GPS de onde a foto foi tirada.'
          },
          {
            n: '03',
            title: 'Limpa e leva de volta',
            text: 'Um clique redesenha a imagem só com os pixels. Tudo que não é pixel fica pra trás, e a foto continua a mesma pra quem olha.'
          }
        ],
        panelTitle: 'Isso nunca foi escondido',
        panelLead: 'A diferença entre esta tela e a de esconder é quem colocou o dado ali.',
        rows: [],
        notes: [
          'Esteganografia é você escondendo algo de propósito. Metadado é a câmera gravando sem te perguntar, e ficando lá até alguém remover.',
          'Não precisa de senha porque nunca foi segredo. O dado está aberto no arquivo, só não está à vista de quem abre a foto normalmente.',
          'Instagram e WhatsApp já removem isso do que publicam. O risco está no arquivo original, aquele que você manda por email ou anexa como documento.',
          'Foto de celular com localização ligada quase sempre traz GPS. Se foi tirada em casa, aquela coordenada é o seu endereço.'
        ]
      },
      {
        key: 'hash',
        to: '/hash',
        cta: 'Ir tirar uma impressão',
        tab: 'Provar que nada mudou',
        steps: [
          {
            n: '01',
            title: 'Solta o arquivo',
            text: 'Aqui não se criptografa nada. O arquivo só é lido, do começo ao fim.'
          },
          {
            n: '02',
            title: 'Tira a impressão',
            text: 'Ela sai com 64 caracteres. O mesmo arquivo sempre dá os mesmos, em qualquer computador do mundo.'
          },
          {
            n: '03',
            title: 'Compara',
            text: 'Cola a impressão que quem enviou te passou. Se bater, o arquivo chegou inteiro. Se não bater, alguma coisa mudou no caminho.'
          }
        ],
        panelTitle: 'Isso não é criptografia',
        panelLead: 'É a outra metade do problema, e as pessoas confundem as duas o tempo todo.',
        rows: [],
        notes: [
          'Hash é rua de mão única. Não tem senha e não tem volta. Não dá pra recuperar o arquivo a partir da impressão, e é exatamente esse o objetivo.',
          'Criptografia responde "alguém consegue ler isso". Hash responde "isso continua sendo a mesma coisa". Muitas vezes você quer as duas, mas são ferramentas diferentes.',
          'Muda um bit do arquivo e cerca de metade da impressão muda. Tem um simulador neste site que desenha esses 256 bits pra você ver acontecendo.',
          'O SHA-1 está na prateleira como aviso. Em 2017 o Google produziu dois arquivos diferentes com o mesmo SHA-1, e por isso ele não prova mais nada.'
        ]
      },
      {
        key: 'learn',
        to: '/simuladores',
        cta: 'Ir mexer nos simuladores',
        tab: 'Entender como funciona',
        steps: [
          {
            n: '01',
            title: 'Escolhe uma máquina',
            text: 'São seis, da Enigma de 1918 ao disco de cifra de 1467. Todas rodam o algoritmo de verdade, não são animação.'
          },
          {
            n: '02',
            title: 'Mexe nela',
            text: 'Digita na Enigma e vê a lâmpada acender. Arrasta o anel do disco. Muda uma letra e vê metade dos bits do hash virar.'
          },
          {
            n: '03',
            title: 'Abre os livros da estante',
            text: 'Vinte e seis métodos explicados passo a passo, cada um com um exemplo rodando no mesmo código que o site usa.'
          }
        ],
        panelTitle: 'Por que isso está aqui',
        panelLead: 'Um site que pede a sua confiança precisa mostrar como funciona por dentro.',
        rows: [],
        notes: [
          'Kerckhoffs escreveu em 1883 que a segurança tem que estar na chave e não no segredo do método. Se esconder o algoritmo fosse necessário, o algoritmo já seria ruim.',
          'Por isso tudo aqui é aberto: o formato do arquivo, o número de iterações, o tamanho do bloco e o código inteiro.',
          'O quebrador de César existe pelo mesmo motivo. É uma ferramenta de ataque num site de defesa, mostrando na prática por que cifra clássica não protege nada.',
          'O cofre lacrado é o teste mais direto: a senha não está escrita em lugar nenhum do código, só a pista. Abrir o código fonte não adianta.'
        ]
      }
    ],

    anatomyTitle: 'O que tem dentro do .cgph',
    anatomyLead: 'Todo arquivo lacrado é montado assim. Byte por byte.',
    anatomy: [
      ['CGPH', '4 bytes', 'assinatura, pro site saber que o arquivo é nosso'],
      ['01', '1 byte', 'versão do formato, pra arquivo antigo continuar abrindo'],
      ['01', '1 byte', 'qual algoritmo lacrou'],
      ['310000', '4 bytes', 'quantas vezes a senha foi esticada'],
      ['sal', '16 bytes', 'aleatório, pra mesma senha nunca dar a mesma chave'],
      ['4 MB', '4 bytes', 'tamanho de cada bloco'],
      ['bloco 0', 'IV + dados', 'o nome e o tipo originais, criptografados'],
      ['bloco 1..n', 'IV + dados + etiqueta', 'o arquivo em si, cortado em pedaços e assinado']
    ],

    whyEyebrow: 'Por que é assim',
    whyTitle: 'Não tem servidor pra confiar.',
    whyText:
      'A maioria dos sites de criptografia sobe o seu arquivo, faz o trabalho na máquina deles e pede pra você acreditar que apagaram depois. Esse aqui faz tudo com o motor de criptografia que já vem no seu navegador. Abre a aba de rede enquanto usa. Não sai nada.',
    whyPoints: [
      'AES-256-GCM, a mesma cifra que o seu banco usa',
      'PBKDF2-SHA256 com 310 mil iterações',
      'Segredo escondido em foto vai criptografado antes de entrar',
      'SHA-256 e SHA-512 pras impressões, e 22 cifras clássicas pra aprender',
      'Sem conta, sem cookie, sem banco de dados'
    ],

    closingTitle: 'Tem coisa que é só sua.',
    closingText: 'Deixa continuar sendo.',
    closingCta: 'Lacrar alguma coisa'
  },

  encrypt: {
    eyebrow: 'Lacrar',
    title: 'Tranca isso.',
    lead: 'Escolhe um arquivo ou escreve uma mensagem. A senha é a única chave, então capricha nela.',
    tabFile: 'Arquivo',
    tabText: 'Mensagem',
    drop: 'Solta um arquivo aqui',
    dropHint: 'ou clica pra escolher',
    textPlaceholder: 'Escreve o segredo que você quer esconder...',
    action: 'Lacrar',
    working: 'Lacrando...',
    done: 'Lacrado e pronto.',
    download: 'Baixar arquivo lacrado',
    copy: 'Copiar a mensagem',
    copied: 'Copiado',
    again: 'Fazer outro'
  },

  decrypt: {
    eyebrow: 'Abrir',
    title: 'Quebra o lacre.',
    lead: 'Traz de volta um arquivo .cgph ou cola uma mensagem lacrada, e digita a senha que foi usada.',
    tabFile: 'Arquivo',
    tabText: 'Mensagem',
    drop: 'Solta o arquivo lacrado aqui',
    dropHint: 'ou clica pra escolher',
    textPlaceholder: 'Cola aqui a mensagem lacrada...',
    action: 'Abrir',
    working: 'Abrindo...',
    done: 'Aberto. Tá aqui.',
    download: 'Baixar o original',
    copy: 'Copiar o texto',
    copied: 'Copiado',
    again: 'Abrir outro'
  },

  seo: {
    home: {
      title: 'Cryptographer, criptografia que roda dentro do seu navegador',
      description:
        'Tranque arquivos com senha, esconda segredos dentro de fotos e áudio, veja o que suas fotos entregam e tire a impressão digital de um arquivo. Nada sai do seu navegador.'
    },
    encrypt: {
      title: 'Criptografar arquivo com senha',
      description:
        'Tranque qualquer arquivo ou mensagem com AES-256-GCM e uma senha sua. Sai um .cgph ou um .zip que abre no 7-Zip. Sem envio, sem conta, sem servidor.'
    },
    decrypt: {
      title: 'Descriptografar arquivo .cgph',
      description:
        'Traga de volta um arquivo ou uma mensagem que foi trancada aqui, usando a mesma senha. Tudo acontece dentro do navegador, o arquivo nunca é enviado.'
    },
    hide: {
      title: 'Esconder senha dentro de foto ou áudio',
      description:
        'Esteganografia no navegador: põe um segredo nos pixels de um PNG ou nas amostras de um WAV, e tira de lá depois. A foto continua abrindo normal em qualquer programa.'
    },
    metadata: {
      title: 'Ver e limpar os metadados EXIF da foto',
      description:
        'Descubra o que a sua foto entrega sem você saber, câmera, data e até a coordenada de GPS de onde foi tirada, e apague isso antes de mandar pra alguém.'
    },
    hash: {
      title: 'Calcular o hash SHA-256 de um arquivo',
      description:
        'Tire a impressão digital SHA-1, SHA-256, SHA-384 ou SHA-512 de um arquivo ou texto e compare com o valor esperado pra provar que nada foi alterado no caminho.'
    },
    lab: {
      title: 'Simuladores de cifras clássicas',
      description:
        'César, Vigenère, Enigma e outras cifras funcionando passo a passo na tela, pra entender como cada uma embaralha o texto e por que nenhuma delas protege nada hoje.'
    },
    privacy: {
      title: 'Política de privacidade',
      description:
        'O que o site faz com os seus dados: nada. Não existe servidor, banco de dados nem conta, e nenhum arquivo ou senha sai do seu navegador.'
    },
    terms: {
      title: 'Termos de uso',
      description: 'As regras de uso do Cryptographer e os limites do que ele promete.'
    },
    cookies: {
      title: 'Cookies',
      description:
        'Quais cookies o site usa e por quê. Só o necessário pra lembrar o idioma e o tema que você escolheu.'
    },
    notFound: {
      title: 'Página não encontrada',
      description: 'Esse endereço não existe aqui.'
    },
    features: [
      'Criptografar arquivos com AES-256-GCM',
      'ZIP com senha AES-256',
      'Esconder segredos em imagem e áudio',
      'Ler e limpar metadados EXIF',
      'Calcular hash SHA-1, SHA-256, SHA-384 e SHA-512',
      'Simuladores de cifras clássicas'
    ]
  },

  form: {
    password: 'Senha',
    passwordPlaceholder: 'aquela que você vai lembrar',
    confirm: 'Digita de novo',
    show: 'Mostrar',
    hide: 'Esconder',
    method: 'Método',
    methodSoon: 'em breve',
    strengthWeak: 'fraca',
    strengthOk: 'razoável',
    strengthGood: 'boa',
    strengthStrong: 'forte',
    wrongType: 'Esse não é um arquivo {ext}. Traz de volta o arquivo lacrado que o site te deu.',
    tooBig:
      'Esse arquivo tem {size}, e o limite aqui é {max}. Tudo roda dentro do seu navegador, e isso é o que ele aguenta segurar na memória de uma vez.',
    emptyFile: 'Esse arquivo está vazio, não tem nada pra lacrar.',
    accepts: 'Aceita:',
    limit: 'Limite:',
    anyFile: 'qualquer arquivo, de qualquer tipo',
    mismatch: 'As duas senhas estão diferentes.',
    needFile: 'Falta escolher o arquivo.',
    needText: 'Falta escrever o texto.',
    needPassword: 'Falta a senha.'
  },

  methods: {
    secure: 'Proteção de verdade',
    classic: 'Clássicas, pra aprender',
    onlyText: 'Cifra clássica só funciona em texto, não em arquivo.',
    noKey: 'Essa aqui não usa senha.',
    kdfNote: { aes: 'rápido', argon: 'mais duro de quebrar' },
    argonNote:
      'O Argon2id troca a senha por chave usando 64 MB de memória, além de tempo. Placa de vídeo quebra PBKDF2 rápido porque roda milhares de contas ao mesmo tempo, mas não tem 64 MB sobrando por núcleo pra sustentar isso. Em troca, demora alguns segundos a mais aqui do seu lado.',
    names: {
      aes: 'AES-256-GCM',
      argon: 'AES-256-GCM + Argon2id',
      caesar: 'César',
      vigenere: 'Vigenère',
      xor: 'XOR',
      atbash: 'Atbash',
      rot13: 'ROT13',
      base64: 'Base64',
      morse: 'Morse',
      a1z26: 'A1Z26',
      railfence: 'Zigue-zague',
      polybius: 'Políbio',
      binary: 'Binário',
      hex: 'Hexadecimal',
      playfair: 'Playfair',
      bacon: 'Bacon',
      affine: 'Afim',
      scytale: 'Cítala',
      rot47: 'ROT47',
      base32: 'Base32',
      ascii: 'ASCII',
      nato: 'OTAN',
      tap: 'Código de batida',
      braille: 'Braille',
      sha256: 'SHA-256',
      sha512: 'SHA-512',
      sha1: 'SHA-1'
    }
  },

  lab: {
    eyebrow: 'Bancada',
    title: 'Simuladores de criptografia',
    lead: 'Seis máquinas que você opera. Nada aqui é foto de coisa nenhuma, é a coisa mesmo, rodando o algoritmo de verdade no seu navegador.',
    seeAll: 'Ver todos os simuladores',
    back: 'Voltar pro começo',

    enigma: {
      title: 'Enigma',
      lead: 'Três rotores que andam uma casa a cada tecla, com a fiação original e o duplo passo do rotor do meio. Digita o mesmo texto com os rotores de volta em AAA e a mensagem volta.',
      body: [
        'Scherbius patenteou a máquina em 1918 pra vender a banco, e acabou virando o coração da comunicação militar alemã na Segunda Guerra. Cada rotor é um alfabeto embaralhado; eles andam a cada tecla, então a mesma letra digitada duas vezes seguidas sai diferente das duas vezes.',
        'O que quebrou a Enigma não foi força bruta, foi um defeito de projeto: o refletor garante que nenhuma letra jamais vire ela mesma. Isso parece detalhe, mas foi o fio que Bletchley Park puxou pra derrubar o resto, com Turing e as máquinas Bomba do outro lado.',
        'Uma curiosidade que quase toda simulação da internet erra: o rotor do meio às vezes anda duas vezes seguidas, o chamado duplo passo. Aqui ele está implementado, junto com a fiação original dos rotores I, II e III e do refletor B.'
      ],
      tip: 'Digita alguma coisa, anota o que saiu, clica em voltar os rotores e digita o que saiu. A mensagem original reaparece. Essa reciprocidade é o que permitia o operador do outro lado ler sem fazer nada diferente.',
      rotors: 'Rotores',
      type: 'Digite aqui',
      out: 'Sai da máquina',
      reset: 'Voltar os rotores',
      at: 'rotores em'
    },

    crack: {
      title: 'Quebrador de César',
      lead: 'Cola um texto cifrado com César. Ele conta quantas vezes cada letra aparece, desenha as barras e acha o deslocamento sozinho, comparando com a frequência das letras no português de verdade.',
      body: [
        'A ideia é do século IX, do árabe Al-Kindi: em qualquer idioma, algumas letras aparecem muito mais que outras. Em português, A e E juntas são mais de um quarto de todo texto. Cifra que só troca cada letra por outra fixa não esconde essa assinatura, só a desloca.',
        'O que roda aqui é qui-quadrado. Pra cada um dos 26 deslocamentos possíveis, ele compara a frequência do texto com a frequência real do português e escolhe o que erra menos. Não é tentativa e erro, é estatística, e por isso é instantâneo.',
        'É por isso que César, Vigenère e as outras estão marcadas como inseguras na prateleira. Elas não caem por falta de esforço de quem inventou, caem porque a linguagem humana tem padrão demais.'
      ],
      tip: 'Cola qualquer texto cifrado com César no campo. Quanto mais longo, mais certeira fica a estatística: abaixo de umas doze letras ele avisa que não dá pra concluir nada.',
      input: 'Texto cifrado',
      freq: 'Frequência das letras',
      found: 'Deslocamento encontrado',
      short: 'Cola um texto maior pra estatística ter com o que trabalhar.'
    },

    ava: {
      title: 'Avalanche do hash',
      lead: 'Os 256 bits do hash desenhados como quadrados. Muda uma letra e cerca de metade vira, marcados em vermelho. É por isso que hash consegue provar que um arquivo chegou inteiro.',
      body: [
        'Cada quadradinho é um bit do resultado. Preto é um, claro é zero. Muda uma vírgula do texto e cerca de metade deles vira, sem nenhum padrão que ligue a mudança de entrada à mudança de saída. Isso chama efeito avalanche, e é exigência de projeto, não acaso.',
        'É essa propriedade que faz hash servir pra provar integridade. Se uma alteração minúscula gerasse um resultado parecido, dava pra ir chegando perto do arquivo original por aproximação. Como não gera, a única forma de bater a impressão é ter exatamente o mesmo arquivo.',
        'Quando duas entradas diferentes dão a mesma saída, isso chama colisão, e significa que o algoritmo morreu. Foi o que aconteceu com o SHA-1 em 2017, quando o Google publicou dois PDFs diferentes com a mesma impressão digital.'
      ],
      tip: 'Digita uma frase, olha o desenho, e depois troca uma letra só. Compara os dois. O contador embaixo diz quantos dos 256 bits mudaram.',
      text: 'Texto',
      hint: 'Muda uma letra só e olha quantos quadrados viram.',
      bits: '256 bits do hash',
      hex: 'Hash em hexadecimal',
      changed: 'de 256 bits mudaram',
      start: 'Agora muda uma letra ali em cima.'
    },

    vault: {
      title: 'O cofre lacrado',
      lead: 'Uma mensagem de verdade, lacrada com AES-256-GCM na hora que esta página carregou. A senha não está escrita em lugar nenhum do código, só a pista está.',
      body: [
        'Essa mensagem foi criptografada com AES-256-GCM no instante em que a página carregou, com sal aleatório e chave derivada por PBKDF2. Não existe comparação de senha em lugar nenhum do código: quem decide se abre é o próprio algoritmo conseguindo ou não autenticar o conteúdo.',
        'Isso quer dizer que abrir o código fonte não adianta. Você vai achar o texto criptografado e a pista, nunca a senha, porque ela não está escrita em lugar nenhum. É a mesma garantia que o site inteiro oferece, só que aqui dá pra testar em trinta segundos.',
        'A ideia veio de CTF, aquelas competições de segurança onde o desafio é achar uma informação escondida. Um cofre desses num portfólio faz a pessoa parar, procurar e voltar, que é bem mais do que um site normal consegue.'
      ],
      tip: 'A pista aponta pro ano do disco de Alberti, que está escrito na seção do disco lá na home. Erra de propósito primeiro, pra ver o lacre tremer sem abrir.',
      locked: 'Lacrado com AES-256-GCM. Precisa da senha.',
      clue: 'Pista: o ano em que Alberti desenhou o primeiro disco de cifra. Está escrito na seção do disco, lá na home.',
      try: 'tenta a senha',
      open: 'abrir',
      wrong: 'Essa senha não quebra o lacre.'
    },

    time: {
      title: 'Quatro mil anos',
      lead: 'De um escriba trocando hieróglifos até os padrões pós-quânticos. Arrasta pro lado.',
      body: [
        'São quatro mil anos em dezesseis paradas, de um escriba egípcio trocando hieróglifos de propósito até os padrões pós-quânticos publicados em 2024. Arrasta pro lado com o mouse ou com o dedo.',
        'Lendo de ponta a ponta aparece um padrão incômodo: toda cifra considerada impossível na época dela acabou caindo. Vigenère aguentou três séculos e caiu. A Enigma era orgulho nacional e caiu. O SHA-1 sustentou a web por vinte anos e caiu.',
        'A outra coisa que a linha mostra é a virada de 1883, quando Kerckhoffs escreveu que a segurança tem que estar na chave e não no segredo do método. É por isso que este site publica exatamente como cada coisa funciona: se esconder o algoritmo fosse necessário, o algoritmo já seria ruim.'
      ],
      tip: 'Cada marco tem um lacre de cera numerado. Os quatro últimos são os que mais importam pra hoje: RSA, AES, a queda do SHA-1 e o pós-quântico.',
      drag: 'arrasta pro lado',
      marks: [
        [
          '1900 a.C.',
          'Um escriba egípcio troca hieróglifos de propósito num túmulo. O primeiro registro que existe.'
        ],
        [
          '600 a.C.',
          'Atbash. Escribas hebreus invertem o alfabeto, e a cifra aparece no Livro de Jeremias.'
        ],
        ['150 a.C.', 'Políbio monta o quadrado de cinco por cinco pra mandar mensagem com tochas.'],
        ['50 a.C.', 'César desloca três casas pra escrever às legiões.'],
        [
          '1467',
          'Alberti desenha o disco de cifra. Nasce a troca de alfabeto no meio da mensagem.'
        ],
        ['1553', 'Bellaso publica a cifra que o mundo acabaria chamando de Vigenère.'],
        [
          '1854',
          'Playfair leva ao governo britânico a primeira cifra que trabalha com pares de letras.'
        ],
        ['1863', 'Kasiski publica como quebrar Vigenère. Três séculos de fama caem.'],
        ['1918', 'Scherbius patenteia a Enigma.'],
        ['1941', 'Bletchley Park lê o tráfego alemão. Turing e a Bomba.'],
        ['1977', 'DES vira padrão federal americano.'],
        ['1977', 'RSA. Pela primeira vez dá pra trocar segredo sem combinar chave antes.'],
        ['1991', 'Zimmermann solta o PGP e a criptografia forte vaza pras pessoas comuns.'],
        ['2001', 'Rijndael vence o concurso e vira AES, que é o que este site usa.'],
        ['2017', 'Google produz dois arquivos com o mesmo SHA-1. O algoritmo se aposenta.'],
        ['2024', 'NIST publica os primeiros padrões pós-quânticos.']
      ]
    }
  },

  disc: {
    eyebrow: 'Desde 1467',
    title: 'Gira o anel você mesmo.',
    lead: 'Esse é o disco do Alberti. Arrasta o anel de dentro, ou usa as setas. A posição em que você deixar vira a chave, e o texto aqui embaixo é convertido na hora com ela. Volta o anel pro mesmo lugar e a mensagem volta.',
    body: [
      'Alberti desenhou isso em 1467 e mudou a criptografia de vez. Antes dele, uma cifra trocava cada letra por outra fixa, e a análise de frequência derrubava tudo. Com dois anéis que giram, o mesmo A pode virar letras diferentes ao longo da mensagem.',
      'A posição em que você deixa o anel é a chave. Quem receber precisa saber essa posição pra girar até o mesmo lugar e ler. É a primeira aparição da ideia de chave separada do método, três séculos antes de alguém escrever isso como princípio.',
      'O AES faz a mesma coisa que este disco, só que com 256 bits no lugar de 26 posições, e trocando a tabela a cada bloco em vez de a cada letra.'
    ],
    tip: 'Arrasta o anel de dentro ou usa as setas. O texto embaixo converte na hora. Volta pro mesmo deslocamento e a mensagem original reaparece.',
    hint: 'arrasta o anel de dentro',
    shift: 'Deslocamento',
    plain: 'Seu texto',
    result: 'No disco',
    sample: 'ataque ao amanhecer',
    back: 'girar pra trás',
    forward: 'girar pra frente'
  },

  shelf: {
    eyebrow: 'A prateleira inteira',
    title: 'Cada método, explicado.',
    lead: 'Tira um da prateleira. Cada livro abre com o passo a passo do método e um exemplo rodando ao vivo, no mesmo código que o site usa.',
    open: 'abrir',
    close: 'Devolver pra estante',
    example: 'Exemplo ao vivo',
    plain: 'Aberto',
    sealed: 'Cifrado',
    safeYes: 'Seguro hoje',
    safeNo: 'Não confie segredo a isso',
    sample: 'ataque ao amanhecer',
    key: 'chave usada',
    books: {
      aes: {
        tag: 'O que esse site usa de verdade',
        steps: [
          'A sua senha passa 310 mil vezes pelo PBKDF2 junto com um sal aleatório, e vira uma chave de 256 bits. É essa repetição que torna caro testar senha em massa.',
          'O arquivo é cortado em blocos de 4 MB. Cada bloco ganha um número aleatório usado uma vez só, e a posição dele é assinada junto, então ninguém troca a ordem nem remove um bloco.',
          'Todo bloco carrega uma etiqueta de autenticação de 16 bytes. Se mexerem em um único bit do arquivo, a abertura se recusa a rodar em vez de devolver lixo.'
        ]
      },
      caesar: {
        tag: 'Roma, por volta de 50 a.C.',
        steps: [
          'Escolhe um número. O próprio César usava três.',
          'Anda com cada letra essa quantidade de casas pra frente no alfabeto. A vira D, B vira E, e o Z dá a volta e cai no C.',
          'Pra ler, anda o mesmo tanto pra trás. Só existem 25 deslocamentos possíveis, então qualquer um quebra testando todos em menos de um minuto.'
        ]
      },
      vigenere: {
        tag: 'Por três séculos, considerada impossível',
        steps: [
          'Escreve a chave embaixo da mensagem, repetindo ela até acabar as letras.',
          'Cada letra da chave diz quantas casas andar com a letra de cima. A mesma letra da mensagem vira letras diferentes dependendo de onde ela cai.',
          'Aguentou uns trezentos anos, até o Kasiski perceber que pedaços repetidos na mensagem entregam o tamanho da chave.'
        ]
      },
      xor: {
        tag: 'A peça que sustenta tudo que é moderno',
        steps: [
          'A mensagem e a chave viram bytes crus.',
          'Cada byte da mensagem é combinado com um byte da chave por ou exclusivo: bit igual vira zero, bit diferente vira um.',
          'Fazendo duas vezes com a mesma chave, volta o original. Cifra moderna é construída em cima disso, só que com chave do tamanho da mensagem e nunca repetida.'
        ]
      },
      atbash: {
        tag: 'Escribas hebreus, antes de Roma existir',
        steps: [
          'Escreve o alfabeto normal e embaixo dele o alfabeto de trás pra frente.',
          'Troca cada letra pela que está embaixo. A vira Z, B vira Y.',
          'Não tem chave nenhuma, então quem reconhece o padrão lê na hora. Ela aparece no Livro de Jeremias.'
        ]
      },
      rot13: {
        tag: 'Não é segurança, é uma cortina',
        steps: [
          'É o César com o deslocamento travado em treze.',
          'Treze é metade de vinte e seis, então aplicar duas vezes devolve o original. Um botão só faz os dois trabalhos.',
          'Nunca foi feito pra proteger nada. Serve pra esconder spoiler e final de piada, pra o olho não pegar sem querer.'
        ]
      },
      base64: {
        tag: 'Isso nem é cifra',
        steps: [
          'Os bytes são lidos de três em três, o que dá vinte e quatro bits.',
          'Esses vinte e quatro bits viram quatro grupos de seis, e cada grupo escolhe um caractere numa tabela de sessenta e quatro.',
          'Não esconde nada. Existe pra dado binário conseguir passar por canal que só aceita texto. Está na prateleira justamente pra você saber diferenciar.'
        ]
      },
      morse: {
        tag: 'Não era segredo, era velocidade',
        steps: [
          'Cada letra vira um padrão de marcas curtas e longas.',
          'As letras mais comuns ganharam os padrões mais curtos. O E é um ponto só, e foi por isso que ele ganhou de todos os códigos concorrentes no telégrafo.',
          'Qualquer um com a tabela lê. Foi feito pra viajar por um fio, não pra guardar segredo.'
        ]
      },
      a1z26: {
        tag: 'A primeira cifra que toda criança inventa',
        steps: [
          'A é um, B é dois, e assim até o Z no vinte e seis.',
          'Os números vão separados por espaço, e a barra marca onde a palavra acaba. Não esconde nada, mas transforma letra em conta, que é onde toda cifra séria começa.'
        ]
      },
      railfence: {
        tag: 'Nada é trocado, só mudado de lugar',
        steps: [
          'Escreve a mensagem em zigue-zague descendo e subindo por três linhas, uma letra por passo.',
          'Depois lê linha por linha, de cima pra baixo. As letras continuam todas ali, só em outra ordem. Isso é transposição, a outra metade da criptografia clássica.'
        ]
      },
      polybius: {
        tag: 'Grécia, século II a.C.',
        steps: [
          'Desenha um quadrado de cinco por cinco e enche com o alfabeto. O I e o J dividem a mesma casa, porque vinte e seis letras não cabem em vinte e cinco quadrados.',
          'Cada letra vira a linha e a coluna dela. O Políbio inventou isso pra mandar mensagem com tochas, uma mão pra linha e outra pra coluna.'
        ]
      },
      binary: {
        tag: 'O que a máquina lê de verdade',
        steps: [
          'Cada caractere vira um byte, e cada byte vira oito uns e zeros.',
          'Aqui não tem nada escondido. É isso que está embaixo da lupa lá em cima: o mesmo quadro, escrito do jeito que o computador guarda.'
        ]
      },
      hex: {
        tag: 'Binário, mas legível por gente',
        steps: [
          'Cada byte vira dois caracteres de zero a f, contando de dezesseis em dezesseis em vez de dez em dez.',
          'É o mesmo dado do binário, quatro vezes mais curto. Toda cor desse site está escrita assim.'
        ]
      },
      playfair: {
        tag: 'Londres, 1854',
        steps: [
          'A sua chave preenche um tabuleiro de cinco por cinco, e o resto do alfabeto vem depois. O I e o J dividem a mesma casa.',
          'As letras são pegas de duas em duas. Mesma linha, cada uma anda pra direita. Mesma coluna, cada uma desce. Nos outros casos elas trocam de coluna e ficam na linha delas.',
          'Foi a primeira cifra a trabalhar com pares em vez de letra sozinha, o que mata a contagem simples de frequência. Os britânicos usaram nas duas guerras.'
        ]
      },
      bacon: {
        tag: 'A mensagem escondida na própria fonte',
        steps: [
          'Cada letra vira cinco marcas, A ou B, contando em binário três séculos antes de binário ter esse nome.',
          'A sacada é que as marcas não precisavam ser letras. Bacon imprimia usando duas fontes levemente diferentes, então um parágrafo inocente carregava uma segunda mensagem dentro do próprio desenho das letras.'
        ]
      },
      affine: {
        tag: 'César com multiplicação',
        steps: [
          'Cada letra vira número, é multiplicada e depois somada, tudo contado em volta de um círculo de vinte e seis.',
          'O multiplicador não pode ter fator comum com vinte e seis, senão duas letras diferentes caem na mesma e nada volta. É por isso que só dez multiplicadores funcionam.'
        ]
      },
      scytale: {
        tag: 'Esparta, século V a.C.',
        steps: [
          'Enrola uma tira de couro num bastão, escreve a mensagem ao longo dele e desenrola. As letras ficam espalhadas.',
          'Só um bastão exatamente da mesma grossura alinha tudo de novo. A chave não é uma palavra, é um objeto, e essa é a graça.'
        ]
      },
      rot47: {
        tag: 'O ROT13 dos programadores',
        steps: [
          'Pega toda a faixa visível do ASCII, noventa e quatro caracteres contando número e pontuação, e anda quarenta e sete casas com cada um.',
          'Quarenta e sete é metade de noventa e quatro, então aplicar duas vezes devolve o original, igualzinho ao ROT13. A diferença é que ele mexe também nos símbolos, que o ROT13 deixa passar.'
        ]
      },
      base32: {
        tag: 'Feito pra ser lido em voz alta',
        steps: [
          'Os bits são lidos de cinco em cinco e cada grupo escolhe entre trinta e dois caracteres: o alfabeto mais os dígitos de dois a sete.',
          'O zero, o um, o oito e o nove ficaram de fora de propósito, porque se confundem com O, I, B e g. É por isso que os seus códigos de backup de dois fatores usam isso.'
        ]
      },
      ascii: {
        tag: 'O número por trás de cada letra',
        steps: [
          'Todo caractere já é um número dentro da máquina. O A é sessenta e cinco, o a é noventa e sete, o espaço é trinta e dois.',
          'Isso aqui só mostra esses números. É daqui que o XOR e tudo que é moderno realmente começa a funcionar.'
        ]
      },
      nato: {
        tag: 'Feito pra rádio ruim',
        steps: [
          'Cada letra vira uma palavra escolhida pra sobreviver a chiado, sotaque e ligação ruim.',
          'Não é cifra, é o oposto: existe pra nada ser entendido errado. Está na prateleira porque clareza e sigilo são as duas pontas do mesmo problema.'
        ]
      },
      tap: {
        tag: 'Escrito na parede da cela',
        steps: [
          'O alfabeto entra num tabuleiro de cinco por cinco, e cada letra vira batidas: a linha, uma pausa, a coluna.',
          'Prisioneiros de guerra usavam através da parede, onde voz seria ouvida mas nó do dedo não. O C é batido como K, já que o tabuleiro só comporta vinte e cinco letras.'
        ]
      },
      braille: {
        tag: 'Escrito pra ser lido com a mão',
        steps: [
          'Seis pontos em relevo, num padrão por letra. Louis Braille montou isso aos quinze anos, a partir de um código militar pra ler ordens no escuro.',
          'Também não é sigilo. É a mesma ideia de toda cifra dessa prateleira: um significado carregado num conjunto diferente de formas.'
        ]
      },
      sha256: {
        tag: 'Rua de mão única',
        steps: [
          'Ele mastiga o arquivo inteiro e cospe sessenta e quatro caracteres. O mesmo arquivo sempre dá o mesmo resultado, e não existe caminho de volta.',
          'Muda um bit do arquivo e cerca de metade dos bits da saída mudam. É isso que permite provar que um download chegou inteiro.',
          'Não é criptografia. Não dá pra desfazer, e é exatamente esse o objetivo.'
        ]
      },
      sha512: {
        tag: 'O irmão mais pesado',
        steps: [
          'Mesma ideia do SHA-256, só que trabalhando com palavras de sessenta e quatro bits e devolvendo cento e vinte e oito caracteres.',
          'Em máquina de sessenta e quatro bits ele costuma ser mais rápido que o SHA-256, o que surpreende quase todo mundo.'
        ]
      },
      sha1: {
        tag: 'Quebrado, e mantido aqui como aviso',
        steps: [
          'Ele sustentou a web inteira por vinte anos, assinando certificado e commit de Git.',
          'Em 2017 o Google produziu dois PDFs diferentes com o mesmo SHA-1. A partir do momento que isso é possível, a impressão digital não prova mais nada. Fica na prateleira pra você ver com que cara fica um algoritmo aposentado.'
        ]
      }
    }
  },

  errors: {
    'wrong-password': 'Essa senha não abre esse arquivo.',
    'not-our-file': 'Esse arquivo não foi lacrado aqui.',
    'bad-version': 'Esse arquivo veio de uma versão mais nova do site.',
    'file-too-big': 'Esse arquivo passa de 512 MB, que é mais do que o navegador aguenta segurar.',
    'image-too-small':
      'Essa foto é pequena demais pra esse segredo. Usa uma imagem maior ou um segredo mais curto.',
    'nothing-hidden':
      'Não tem nada escondido nessa foto. Ou ela nunca carregou segredo, ou foi redimensionada ou recomprimida no caminho.',
    corrupted: 'O arquivo está danificado e não dá pra ler até o fim.',
    unknown: 'Alguma coisa quebrou no caminho. Tenta de novo.',
    retry: 'Tentar de novo'
  },

  footer: {
    tag: 'Feito à vista de todos, um arquivo por vez.',
    privacy: 'Privacidade',
    terms: 'Termos',
    cookies: 'Cookies',
    source: 'Código fonte'
  },

  notFound: {
    title: 'Essa página nunca foi lacrada.',
    text: 'O endereço existe na sua cabeça, mas não nesse site.',
    cta: 'Voltar pro começo'
  },

  legal: {
    updated: 'Atualizado em',
    date: 'agosto de 2026',
    privacy: {
      title: 'Privacidade',
      lead: 'A versão curta: os seus arquivos nunca saem do seu computador, então não sobra nada aqui pra gente coletar.',
      blocks: [
        {
          h: 'Os seus arquivos',
          p: 'Criptografar e descriptografar acontece dentro do seu navegador, usando a Web Crypto API. Nenhum arquivo, nenhuma senha e nenhum resultado é enviado pra servidor. Esse projeto não tem endpoint de upload.'
        },
        {
          h: 'A sua senha',
          p: 'A senha fica na memória da aba enquanto o processo roda e some quando você sai ou recarrega a página. Ela não é guardada, não vai pra log e não tem como ser recuperada. Se você esquecer, ninguém abre o arquivo, nem nós.'
        },
        {
          h: 'O que fica no seu aparelho',
          p: 'Três itens no localStorage: o idioma que você escolheu, o tema claro ou escuro, e se você já fechou o aviso sobre perder a senha. Só isso. Sem conta, sem sessão, sem identificador de rastreio.'
        },
        {
          h: 'Se você falar com a gente',
          p: 'Se mandar um email, esse email fica no provedor de email, não aqui. Nada do que você faz no site é ligado a ele.'
        }
      ]
    },
    terms: {
      title: 'Termos de uso',
      lead: 'Livre pra usar, oferecido como está, com um risco que você precisa entender antes de começar.',
      blocks: [
        {
          h: 'Não existe recuperar',
          p: 'Esse é o ponto importante. A senha é a única chave. Não tem link de redefinir, não tem cópia de segurança e não tem porta dos fundos. Se você perder a senha, o arquivo criptografado se perde de vez. Testa com uma cópia antes de confiar a única versão de alguma coisa.'
        },
        {
          h: 'Sem garantia',
          p: 'O site é oferecido como está, sem garantia de nenhum tipo. É um projeto pessoal, não um produto de segurança auditado. Não use como única proteção de algo que você não pode perder.'
        },
        {
          h: 'A sua parte',
          p: 'Você é responsável pelo que criptografa e por manter os seus próprios backups. Não use o site pra nada ilegal no lugar onde você mora.'
        },
        {
          h: 'Mudanças',
          p: 'O formato do arquivo carrega um número de versão, então arquivos gerados por versões antigas continuam abrindo. Se um dia isso precisar mudar, vai ser avisado nessa página antes.'
        }
      ]
    },
    cookies: {
      title: 'Cookies',
      lead: 'Esse site não usa cookies. Essa é a política inteira, mas segue o detalhe.',
      blocks: [
        {
          h: 'Nenhum cookie',
          p: 'Sem cookie de anúncio, sem cookie de analytics, sem cookie de sessão. Esse site não escreve nada em document.cookie, e é por isso que você nunca viu banner de consentimento aqui.'
        },
        {
          h: 'Três itens no localStorage',
          p: 'A chave cryptographer:lang guarda se você escolheu português ou inglês, cryptographer:theme guarda se você deixou a luz acesa ou apagada, e cryptographer:warn guarda que você já leu o aviso sobre perder a senha, pra ele não aparecer de novo. Os três são estritamente funcionais, nunca saem do seu navegador, e você pode limpar pelas configurações do navegador quando quiser.'
        }
      ]
    }
  }
}
