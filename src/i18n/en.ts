export const en = {
  nav: {
    encrypt: 'Encrypt',
    decrypt: 'Decrypt',
    hash: 'Fingerprint',
    how: 'How it works',
    navHide: 'Hide',
    navMeta: 'Metadata',
    menu: 'Menu',
    skip: 'Skip to content'
  },

  hash: {
    eyebrow: 'Fingerprint',
    title: 'Prove nothing changed.',
    lead: 'A hash is a one way street. It turns any file into a short fingerprint, and the same file always gives the same one. Change a single bit and the fingerprint changes completely. It does not hide anything, it proves nothing was touched.',
    tabFile: 'File',
    tabText: 'Text',
    drop: 'Drop a file here',
    dropHint: 'or click to choose',
    textPlaceholder: 'Type or paste anything...',
    algo: 'Algorithm',
    action: 'Take the fingerprint',
    working: 'Reading...',
    done: 'Fingerprint taken.',
    copy: 'Copy',
    copied: 'Copied',
    again: 'Do another one',
    verify: 'Compare with a known fingerprint',
    verifyPlaceholder: 'paste the expected hash here',
    match: 'They match. The file is exactly the one you expected.',
    noMatch: 'They do not match. This is not the same file.',
    note: 'This is not encryption. A hash cannot be reversed, so there is no way to get the file back from it.'
  },

  hide: {
    eyebrow: 'Hide',
    title: 'Put a secret inside a photo.',
    lead: 'This is the opposite of locking a file. The photo, or the audio, comes back looking and sounding exactly the same and opens normally in any program, but it carries your secret inside the pixels or the sound samples. Only someone with the password can pull it out.',
    tabHide: 'Hide',
    tabReveal: 'Pull out',
    drop: 'Drop a PNG here',
    dropHint: 'or click to choose',
    formats: 'PNG, BMP, WebP or WAV. A lossy format, like JPEG or MP3, will not work',
    dropHintAudio: 'or click to choose',
    downloadAudio: 'Download the audio',
    warnMp3:
      'MP3, AAC and WhatsApp voice notes do not work either, for the same reason as JPEG: they are lossy formats. Only WAV, which stores the wave sample by sample.',
    dropReveal: 'Drop the photo that carries the secret',
    secret: 'The secret',
    secretPlaceholder: 'a password, a code, a message...',
    action: 'Hide it in the photo',
    actionReveal: 'Pull the secret out',
    working: 'Hiding...',
    workingReveal: 'Looking...',
    done: 'Hidden. The photo looks the same.',
    doneReveal: 'Found it.',
    download: 'Download the photo',
    copy: 'Copy the secret',
    copied: 'Copied',
    again: 'Do another one',
    room: 'This photo holds up to {size} of secret.',
    withPassword:
      'With a password: the secret is encrypted with AES-256 before it goes into the photo. Even someone who suspects it and pulls the bits out finds only noise without the password.',
    withoutPassword:
      'Without a password: the secret goes in as plain text. The photo still looks normal, but any steganography tool reads what is in there. Good for a note, not for a secret.',
    revealNote:
      'Leave it empty and try anyway. The file itself says whether it was encrypted, and only then is the password asked for.',
    howTitle: 'How it works',
    howSteps: [
      'Your secret is encrypted with AES-256 first, so pulling it out of the photo is not enough. Whoever finds it still needs the password.',
      'Then each bit goes into the last bit of a colour. Changing red from 200 to 201 is invisible to the eye, and every pixel carries three of those bits.',
      'The photo is saved again as PNG. It opens in any viewer, and nothing in it looks unusual.'
    ],
    warnTitle: 'What will not work',
    warnJpeg:
      'JPEG does not work, and that is not a limitation of this site. JPEG compression throws away exactly the bits that carry the secret, so it would be destroyed the moment the file was saved. That is why the result always comes out as PNG, even if you put a JPEG in.',
    warnEdit:
      'Do not resize, crop, filter or re-save the photo anywhere else. Any of that erases the secret. Send the file exactly as it came out of here.',
    warnSocial:
      'WhatsApp, Instagram and most social networks recompress every image they receive. The photo arrives fine, but the secret is gone. To send it whole, attach it as a document or a file.',
    warnAlpha:
      'Fully transparent parts of the image are skipped, because the browser can change their colour when saving. A photo with a lot of transparency holds less.'
  },

  archive: {
    title: 'ZIP with a password',
    lead: 'For when the person on the other side is not going to open this site. The file comes back as a ZIP that opens on any computer, asking for the password.',
    note: 'It uses AES-256, the strong standard of the format. That means 7-Zip, WinRAR or Keka open it, but the unzipper built into Windows and macOS does not, because they only understand the old broken encryption from the nineties, which is not going in here.',
    pick: 'What comes out',
    cgph: '.cgph file',
    cgphNote: 'smaller, only opens here',
    zip: '.zip file',
    zipNote: 'opens anywhere, needs 7-Zip'
  },

  meta: {
    eyebrow: 'Metadata',
    title: 'What your photo says about you.',
    lead: 'This is not steganography: nobody hid anything here. The camera writes this data inside the file, in the open, and most people have no idea it exists. Drop a photo and see what it gives away.',
    drop: 'Drop a photo here',
    dropHint: 'or click to choose',
    formats: 'JPEG for camera and GPS data, PNG for software text',
    reading: 'Reading the file...',
    nothing:
      'This photo carries no metadata. Either it never had any, or it was already stripped by some program or social network along the way.',
    gpsTitle: 'This photo knows where you were',
    gpsNote:
      'The camera recorded the exact coordinate where the photo was taken. If it was taken at home, that is your address, and it travels along every time you send the original file.',
    gpsOpen: 'See this point on a map',
    gpsLinkNote:
      'That link opens OpenStreetMap in a new tab and sends the coordinate to them. Nothing is sent unless you click.',
    clean: 'Strip the metadata',
    download: 'Download the clean photo',
    cleanDone:
      'The photo was redrawn from pixels only. Check the result by dropping the clean copy back in here: nothing should be left.',
    howTitle: 'How it works',
    howSteps: [
      'The file is read inside your browser, like everything else on this site. No photo leaves here, and on this screen that matters more than on the others, because what is being read is exactly what you do not want to hand over.',
      'In JPEG the data sits in a section called EXIF, a format of its own inside the file, with make, model, date and, when location is on, the GPS coordinate.',
      'Stripping redraws the image on a canvas and saves it again. Since only the pixels are copied, everything that is not a pixel is left behind. That is more reliable than deleting field by field, because it does not depend on me knowing every field that could exist.'
    ],
    warnTitle: 'Worth knowing',
    warns: [
      'Instagram, Facebook and WhatsApp already strip metadata from the photos they publish. The problem is the original file, the one you send by email, attach to a document, or send as a file instead of an image.',
      'A phone photo with location on almost always carries GPS. It is worth testing with a photo of your own taken at home to see what comes out.',
      'Stripping re-encodes the image, so a JPEG loses a little quality in the process. PNG loses nothing.',
      'Metadata is not only about privacy. The software field gives away which editor was used, which has already exposed edited photos that were presented as originals.'
    ]
  },

  warn: 'Lose the password and the file is gone for good. There is no reset here, and nobody can open it for you.',
  warnOk: 'Got it',

  theme: { toDark: 'Turn the lights off', toLight: 'Turn the lights on' },

  home: {
    eyebrow: 'Nothing leaves your browser',
    titleA: 'Lock a file',
    titleB: 'the way you',
    titleC: 'lock a drawer.',
    lead: 'Five things, all of them inside your browser. Lock a file so nobody opens it without the password. Hide a secret inside a photo or an audio file that still look the same. Turn a message into something unreadable. See what your photo already gives away without you knowing. Or take the fingerprint of a file to prove nobody touched it.',
    ctaPrimary: 'Seal something',
    ctaSecondary: 'Open a sealed file',
    trust: 'Free · No account · No upload · Works offline',

    lensToken: 'Password=62527',
    stepsEyebrow: 'How it works',
    stepsTitle: 'Three steps and a wax seal.',
    steps: [
      {
        n: '01',
        title: 'Drop the file in',
        text: 'Anything up to 512 MB. It is read straight from your disk by the browser, never sent anywhere.'
      },
      {
        n: '02',
        title: 'Write a password',
        text: 'Your password becomes the key. We stretch it 310 thousand times so guessing it in bulk stops being worth the trouble.'
      },
      {
        n: '03',
        title: 'Take the sealed copy',
        text: 'You get a .cgph file. The original name and type travel encrypted inside it, so the file gives nothing away.'
      }
    ],

    guideOf: 'of',
    guidePrev: 'Previous page',
    guideNext: 'Next page',

    guide: [
      {
        key: 'seal',
        to: '/encrypt',
        cta: 'Go lock a file',
        tab: 'Lock a file',
        steps: [
          {
            n: '01',
            title: 'Drop the file in',
            text: 'Anything up to 512 MB. It is read straight from your disk by the browser, never sent anywhere.'
          },
          {
            n: '02',
            title: 'Write a password',
            text: 'Your password becomes the key. We stretch it 310 thousand times so guessing it in bulk stops being worth the trouble.'
          },
          {
            n: '03',
            title: 'Take the sealed copy',
            text: 'A .cgph file that only opens back here, or a .zip with a password that opens on any computer. You choose which one comes out.'
          }
        ],
        panelTitle: 'What is actually inside the .cgph',
        panelLead: 'Every sealed file is laid out like this. Byte for byte.',
        rows: [
          ['CGPH', '4 bytes', 'signature, so the site knows the file is ours'],
          ['01', '1 byte', 'format version, so old files keep opening'],
          ['01', '1 byte', 'which algorithm sealed it'],
          ['310000', '4 bytes', 'how many times the password was stretched'],
          ['salt', '16 bytes', 'random, so the same password never gives the same key'],
          ['4 MB', '4 bytes', 'size of each block'],
          ['block 0', 'IV + data', 'the original name and type, encrypted'],
          ['block 1..n', 'IV + data + tag', 'the file itself, cut into pieces and signed']
        ],
        notes: []
      },
      {
        key: 'hide',
        to: '/esconder',
        cta: 'Go hide a secret',
        tab: 'Hide inside a photo',
        steps: [
          {
            n: '01',
            title: 'Bring a photo',
            text: 'A PNG, a BMP or a WebP. It has to be a format that keeps every pixel exactly as it is.'
          },
          {
            n: '02',
            title: 'Write the secret',
            text: 'It gets encrypted with AES-256 before anything else, so finding it in the photo is not enough. Whoever finds it still needs the password.'
          },
          {
            n: '03',
            title: 'Take the same photo back',
            text: 'It looks identical, opens in any viewer, and carries the secret in the last bit of each colour. Three bits per pixel.'
          }
        ],
        panelTitle: 'Where the secret gets lost',
        panelLead: 'The hard part is not hiding it. It is getting it to arrive.',
        rows: [],
        notes: [
          'JPEG does not work. Its compression throws away exactly the bits that carry the secret, so it would be destroyed the moment the file was saved. That is why the result always comes out as PNG.',
          'Resizing, cropping, filtering or re-saving the photo anywhere else erases it. Send the file exactly as it came out of here.',
          'WhatsApp and Instagram recompress every image they receive. The photo arrives fine and the secret is gone. Attach it as a document instead.',
          'A photo of 1000 by 1000 holds about 375 KB. The site tells you the exact room as soon as you drop the photo in.'
        ]
      },
      {
        key: 'meta',
        to: '/metadados',
        cta: 'Go see what a photo gives away',
        tab: 'See what a photo gives away',
        steps: [
          {
            n: '01',
            title: 'Drop in any photo',
            text: 'Preferably one taken with your own phone that has not been through a social network. That is where the data is still intact.'
          },
          {
            n: '02',
            title: 'Look at what shows up',
            text: 'Make and model of the device, the exact date and time, the program that edited it, and the GPS coordinate of where the photo was taken.'
          },
          {
            n: '03',
            title: 'Strip it and take it back',
            text: 'One click redraws the image from pixels alone. Everything that is not a pixel is left behind, and the photo looks the same to anyone.'
          }
        ],
        panelTitle: 'This was never hidden',
        panelLead:
          'The difference between this screen and the hiding one is who put the data there.',
        rows: [],
        notes: [
          'Steganography is you hiding something on purpose. Metadata is the camera recording without asking, and staying there until someone removes it.',
          'It needs no password because it was never a secret. The data sits open in the file, it is just out of sight when you open the photo normally.',
          'Instagram and WhatsApp already strip this from what they publish. The risk is in the original file, the one you email or attach as a document.',
          'A phone photo with location on almost always carries GPS. If it was taken at home, that coordinate is your address.'
        ]
      },
      {
        key: 'hash',
        to: '/hash',
        cta: 'Go take a fingerprint',
        tab: 'Prove nothing changed',
        steps: [
          {
            n: '01',
            title: 'Drop in the file',
            text: 'Nothing is encrypted here. The file is only read, from beginning to end.'
          },
          {
            n: '02',
            title: 'Take the fingerprint',
            text: 'It comes out as 64 characters. The same file always gives the same ones, on any computer in the world.'
          },
          {
            n: '03',
            title: 'Compare',
            text: 'Paste the fingerprint the sender gave you. If it matches, the file arrived whole. If it does not, something changed on the way.'
          }
        ],
        panelTitle: 'This is not encryption',
        panelLead: 'It is the other half of the problem, and people confuse the two constantly.',
        rows: [],
        notes: [
          'A hash is a one way street. There is no password and no way back. You cannot recover the file from the fingerprint, and that is exactly the point.',
          'Encryption answers "can anyone read this". A hash answers "is this still the same thing". You often want both, but they are different tools.',
          'Change one bit of the file and about half the fingerprint changes. There is a simulator on this site that draws those 256 bits so you can watch it happen.',
          'SHA-1 is on the shelf as a warning. In 2017 Google produced two different files with the same SHA-1, which is why it no longer proves anything.'
        ]
      },
      {
        key: 'learn',
        to: '/simuladores',
        cta: 'Go play with the simulators',
        tab: 'Understand how it works',
        steps: [
          {
            n: '01',
            title: 'Pick a machine',
            text: 'There are six, from the 1918 Enigma to the 1467 cipher disc. All of them run the real algorithm, none is an animation.'
          },
          {
            n: '02',
            title: 'Operate it',
            text: 'Type into the Enigma and watch the lamp light up. Drag the ring on the disc. Change one letter and watch half the hash bits flip.'
          },
          {
            n: '03',
            title: 'Open the books on the shelf',
            text: 'Twenty six methods explained step by step, each with an example running on the same code the site uses.'
          }
        ],
        panelTitle: 'Why this is here',
        panelLead: 'A site that asks for your trust has to show how it works on the inside.',
        rows: [],
        notes: [
          'Kerckhoffs wrote in 1883 that security has to live in the key and not in the secrecy of the method. If hiding the algorithm were necessary, the algorithm would already be bad.',
          'That is why everything here is open: the file format, the number of iterations, the block size and the whole source.',
          'The Caesar breaker is there for the same reason. It is an attack tool on a defence site, showing in practice why classical ciphers protect nothing.',
          'The sealed vault is the most direct test: the password is written nowhere in the code, only the clue. Opening the source will not help.'
        ]
      }
    ],

    anatomyTitle: 'What is actually inside the .cgph',
    anatomyLead: 'Every sealed file is laid out like this. Byte for byte.',
    anatomy: [
      ['CGPH', '4 bytes', 'signature, so the site knows the file is ours'],
      ['01', '1 byte', 'format version, so old files keep opening'],
      ['01', '1 byte', 'which algorithm sealed it'],
      ['310000', '4 bytes', 'how many times the password was stretched'],
      ['salt', '16 bytes', 'random, so the same password never gives the same key'],
      ['4 MB', '4 bytes', 'size of each block'],
      ['block 0', 'IV + data', 'the original name and type, encrypted'],
      ['block 1..n', 'IV + data + tag', 'the file itself, cut into pieces and signed']
    ],

    whyEyebrow: 'Why it works this way',
    whyTitle: 'There is no server to trust.',
    whyText:
      'Most encryption sites upload your file, do the work on their machine and ask you to believe they deleted it. This one does the whole thing with the crypto engine built into your browser. Open the network tab while you use it. Nothing goes out.',
    whyPoints: [
      'AES-256-GCM, the same cipher your bank uses',
      'PBKDF2-SHA256 with 310,000 iterations',
      'Secrets hidden in photos are encrypted before they go in',
      'SHA-256 and SHA-512 for fingerprints, 22 classic ciphers to learn from',
      'No account, no cookies, no database'
    ],

    closingTitle: 'Some things are just yours.',
    closingText: 'Keep them that way.',
    closingCta: 'Seal something'
  },

  encrypt: {
    eyebrow: 'Seal',
    title: 'Lock it up.',
    lead: 'Choose a file or write a message. The password is the only key, so make it a good one.',
    tabFile: 'File',
    tabText: 'Message',
    drop: 'Drop a file here',
    dropHint: 'or click to choose',
    textPlaceholder: 'Write the secret you want to hide...',
    action: 'Seal it',
    working: 'Sealing...',
    done: 'Sealed and ready.',
    download: 'Download sealed file',
    copy: 'Copy the message',
    copied: 'Copied',
    again: 'Do another one'
  },

  decrypt: {
    eyebrow: 'Open',
    title: 'Break the seal.',
    lead: 'Bring back a .cgph file or paste a sealed message, then type the password it was locked with.',
    tabFile: 'File',
    tabText: 'Message',
    drop: 'Drop the sealed file here',
    dropHint: 'or click to choose',
    textPlaceholder: 'Paste the sealed message here...',
    action: 'Open it',
    working: 'Opening...',
    done: 'Open. Here it is.',
    download: 'Download the original',
    copy: 'Copy the text',
    copied: 'Copied',
    again: 'Open another one'
  },

  form: {
    password: 'Password',
    passwordPlaceholder: 'the one you will remember',
    confirm: 'Type it again',
    show: 'Show',
    hide: 'Hide',
    method: 'Method',
    methodSoon: 'soon',
    strengthWeak: 'weak',
    strengthOk: 'fair',
    strengthGood: 'good',
    strengthStrong: 'strong',
    wrongType: 'This is not a {ext} file. Bring back the sealed file the site gave you.',
    tooBig:
      'This file is {size}, and the limit here is {max}. Everything runs inside your browser, and that is as much as it can hold in memory at once.',
    emptyFile: 'This file is empty, there is nothing to seal.',
    accepts: 'Takes:',
    limit: 'Limit:',
    anyFile: 'any file, of any type',
    mismatch: 'The two passwords are different.',
    needFile: 'Pick a file first.',
    needText: 'Write the text first.',
    needPassword: 'The password is missing.'
  },

  methods: {
    secure: 'Real protection',
    classic: 'Classic, for learning',
    onlyText: 'Classic ciphers only work on text, not on files.',
    noKey: 'This one takes no password.',
    kdfNote: { aes: 'fast', argon: 'harder to crack' },
    argonNote:
      'Argon2id turns the password into a key using 64 MB of memory as well as time. A graphics card breaks PBKDF2 quickly because it runs thousands of those sums at once, but it does not have 64 MB to spare per core to sustain this. In exchange, it takes a few seconds longer on your side.',
    names: {
      aes: 'AES-256-GCM',
      argon: 'AES-256-GCM + Argon2id',
      caesar: 'Caesar',
      vigenere: 'Vigenere',
      xor: 'XOR',
      atbash: 'Atbash',
      rot13: 'ROT13',
      base64: 'Base64',
      morse: 'Morse',
      a1z26: 'A1Z26',
      railfence: 'Rail Fence',
      polybius: 'Polybius',
      binary: 'Binary',
      hex: 'Hex',
      playfair: 'Playfair',
      bacon: 'Bacon',
      affine: 'Affine',
      scytale: 'Scytale',
      rot47: 'ROT47',
      base32: 'Base32',
      ascii: 'ASCII',
      nato: 'NATO',
      tap: 'Tap code',
      braille: 'Braille',
      sha256: 'SHA-256',
      sha512: 'SHA-512',
      sha1: 'SHA-1'
    }
  },

  lab: {
    eyebrow: 'Workbench',
    title: 'Cryptography simulators',
    lead: 'Six machines you can operate. Nothing here is a picture of a thing, it is the thing, running the real algorithm in your browser.',
    seeAll: 'See all simulators',
    back: 'Back to the start',

    enigma: {
      title: 'Enigma',
      lead: 'Three rotors that step one place on every key, with the original wiring and the double step of the middle rotor. Type the same text with the rotors back at AAA and the message comes back.',
      body: [
        'Scherbius patented the machine in 1918 to sell to banks, and it ended up at the heart of German military communication in the Second World War. Each rotor is a scrambled alphabet; they step on every key, so the same letter typed twice in a row comes out different both times.',
        'What broke Enigma was not brute force, it was a design flaw: the reflector guarantees that no letter ever becomes itself. That sounds like a detail, but it was the thread Bletchley Park pulled to unravel the rest, with Turing and the Bombe machines on the other side.',
        'One detail almost every simulation online gets wrong: the middle rotor sometimes steps twice in a row, the so called double step. It is implemented here, along with the original wiring of rotors I, II and III and reflector B.'
      ],
      tip: 'Type something, note what came out, reset the rotors and type that back in. The original message reappears. That reciprocity is what let the operator on the other side read without doing anything different.',
      rotors: 'Rotors',
      type: 'Type here',
      out: 'Out of the machine',
      reset: 'Reset the rotors',
      at: 'rotors at'
    },

    crack: {
      title: 'Caesar breaker',
      lead: 'Paste a Caesar ciphertext. It counts how often each letter appears, draws the bars, and finds the shift on its own by comparing against how often each letter shows up in real Portuguese.',
      body: [
        'The idea is from the ninth century, from Al-Kindi: in any language some letters show up far more than others. In Portuguese, A and E together are more than a quarter of any text. A cipher that only swaps each letter for a fixed other one does not hide that signature, it just shifts it.',
        'What runs here is chi squared. For each of the 26 possible shifts it compares the frequency of the text against the real frequency of Portuguese and picks the one that misses least. It is not trial and error, it is statistics, which is why it is instant.',
        'This is why Caesar, Vigenere and the others are marked as unsafe on the shelf. They do not fall for lack of effort from whoever invented them, they fall because human language has too much pattern in it.'
      ],
      tip: 'Paste any Caesar ciphertext into the field. The longer it is, the surer the statistics get: below about twelve letters it tells you there is not enough to conclude anything.',
      input: 'Ciphertext',
      freq: 'Letter frequency',
      found: 'Shift found',
      short: 'Paste a longer text so the statistics have something to work with.'
    },

    ava: {
      title: 'Hash avalanche',
      lead: 'The 256 bits of the hash drawn as squares. Change one letter and about half of them flip, marked in red. This is why a hash can prove a file arrived intact.',
      body: [
        'Each little square is one bit of the result. Dark is a one, light is a zero. Change a comma in the text and about half of them flip, with no pattern connecting the change in the input to the change in the output. That is called the avalanche effect, and it is a design requirement, not an accident.',
        'It is this property that makes a hash useful for proving integrity. If a tiny change produced a similar result, you could creep towards the original file by approximation. Since it does not, the only way to match the fingerprint is to have exactly the same file.',
        'When two different inputs give the same output, that is called a collision, and it means the algorithm is dead. That is what happened to SHA-1 in 2017, when Google published two different PDFs with the same fingerprint.'
      ],
      tip: 'Type a sentence, look at the drawing, then change a single letter. Compare the two. The counter below says how many of the 256 bits changed.',
      text: 'Text',
      hint: 'Change a single letter and watch how many squares turn.',
      bits: '256 bits of the hash',
      hex: 'Hash in hexadecimal',
      changed: 'of 256 bits changed',
      start: 'Now change one letter above.'
    },

    vault: {
      title: 'The sealed vault',
      lead: 'A real message, sealed with AES-256-GCM the moment this page loaded. The password is not written anywhere in the code, only the clue is.',
      body: [
        'This message was encrypted with AES-256-GCM the moment the page loaded, with a random salt and a key derived through PBKDF2. There is no password comparison anywhere in the code: what decides whether it opens is the algorithm itself managing, or failing, to authenticate the content.',
        'That means opening the source code will not help. You will find the ciphertext and the clue, never the password, because it is not written anywhere. It is the same guarantee the whole site offers, except here you can test it in thirty seconds.',
        'The idea comes from CTF, those security competitions where the challenge is to find a hidden piece of information. A vault like this in a portfolio makes someone stop, search and come back, which is a lot more than a normal site manages.'
      ],
      tip: 'The clue points at the year of the Alberti disc, which is written in the disc section on the home page. Get it wrong on purpose first, to watch the seal shake without opening.',
      locked: 'Sealed with AES-256-GCM. Needs the password.',
      clue: 'Clue: the year Alberti drew the first cipher disc. It is written on the disc section of the home page.',
      try: 'try the password',
      open: 'open',
      wrong: 'That password does not break the seal.'
    },

    time: {
      title: 'Four thousand years',
      lead: 'From a scribe altering hieroglyphs to the post quantum standards. Drag it sideways.',
      body: [
        'Four thousand years in sixteen stops, from an Egyptian scribe deliberately swapping hieroglyphs to the post quantum standards published in 2024. Drag it sideways with the mouse or your finger.',
        'Read end to end, an uncomfortable pattern shows up: every cipher considered impossible in its own time eventually fell. Vigenere held for three centuries and fell. Enigma was a point of national pride and fell. SHA-1 carried the web for twenty years and fell.',
        'The other thing the line shows is the turn of 1883, when Kerckhoffs wrote that security has to live in the key and not in the secrecy of the method. That is why this site publishes exactly how each thing works: if hiding the algorithm were necessary, the algorithm would already be bad.'
      ],
      tip: 'Each milestone carries a numbered wax seal. The last four matter most for today: RSA, AES, the fall of SHA-1 and post quantum.',
      drag: 'drag sideways',
      marks: [
        [
          '1900 BC',
          'An Egyptian scribe deliberately swaps hieroglyphs in a tomb. The first record we have.'
        ],
        [
          '600 BC',
          'Atbash. Hebrew scribes flip the alphabet, and the cipher shows up in the Book of Jeremiah.'
        ],
        ['150 BC', 'Polybius builds the five by five square to send messages with torches.'],
        ['50 BC', 'Caesar shifts three places to write to his legions.'],
        ['1467', 'Alberti draws the cipher disc. Swapping alphabets mid message is born.'],
        ['1553', 'Bellaso publishes the cipher the world would end up calling Vigenere.'],
        [
          '1854',
          'Playfair brings the British government the first cipher that works on pairs of letters.'
        ],
        ['1863', 'Kasiski publishes how to break Vigenere. Three centuries of reputation fall.'],
        ['1918', 'Scherbius patents the Enigma.'],
        ['1941', 'Bletchley Park reads German traffic. Turing and the Bombe.'],
        ['1977', 'DES becomes a US federal standard.'],
        [
          '1977',
          'RSA. For the first time two people can share a secret without agreeing on a key first.'
        ],
        ['1991', 'Zimmermann releases PGP and strong cryptography leaks out to ordinary people.'],
        ['2001', 'Rijndael wins the contest and becomes AES, which is what this site uses.'],
        ['2017', 'Google produces two files with the same SHA-1. The algorithm retires.'],
        ['2024', 'NIST publishes the first post quantum standards.']
      ]
    }
  },

  disc: {
    eyebrow: 'Since 1467',
    title: 'Turn the ring yourself.',
    lead: 'This is the Alberti disc. Drag the inner ring, or use the arrows. Whatever position you leave it in becomes the key, and the text below is converted live with it. Turn it back to the same spot and the message returns.',
    body: [
      'Alberti drew this in 1467 and changed cryptography for good. Before him, a cipher swapped each letter for a fixed other one, and frequency analysis brought the whole thing down. With two rings that turn, the same A can become different letters across the message.',
      'The position you leave the ring in is the key. Whoever receives it needs to know that position to turn to the same place and read. It is the first appearance of the idea of a key separate from the method, three centuries before anyone wrote that down as a principle.',
      'AES does the same thing this disc does, except with 256 bits instead of 26 positions, and swapping the table on every block instead of every letter.'
    ],
    tip: 'Drag the inner ring or use the arrows. The text below converts as you go. Return to the same shift and the original message reappears.',
    hint: 'drag the inner ring',
    shift: 'Shift',
    plain: 'Your text',
    result: 'On the disc',
    sample: 'attack at dawn',
    back: 'turn back',
    forward: 'turn forward'
  },

  shelf: {
    eyebrow: 'The whole shelf',
    title: 'Every method, explained.',
    lead: 'Pull one off the shelf. Each book opens with how the method works, step by step, and a live example running the same code the site uses.',
    open: 'open',
    close: 'Put it back',
    example: 'Live example',
    plain: 'Plain',
    sealed: 'Sealed',
    safeYes: 'Safe today',
    safeNo: 'Not safe for secrets',
    sample: 'attack at dawn',
    key: 'key used',
    books: {
      aes: {
        tag: 'The one this site actually uses',
        steps: [
          'Your password goes through PBKDF2 310,000 times with a random salt, which turns it into a 256 bit key. The repetition is what makes guessing passwords in bulk expensive.',
          'The file is cut into 4 MB blocks. Each block gets its own random number used once, and its position number is signed along with it, so nobody can reorder or remove a block.',
          'Every block carries a 16 byte authentication tag. If a single bit of the file is changed, decryption refuses to run instead of returning garbage.'
        ]
      },
      caesar: {
        tag: 'Rome, around 50 BC',
        steps: [
          'Pick a number. Caesar himself used three.',
          'Walk each letter that many places forward in the alphabet. A becomes D, B becomes E, and Z wraps back around to C.',
          'To read it, walk the same number backwards. There are only 25 possible shifts, so anyone can break it by trying all of them in under a minute.'
        ]
      },
      vigenere: {
        tag: 'For three centuries, unbreakable',
        steps: [
          'Write your key under the message, repeating it until it runs out of letters.',
          'Each letter of the key says how far to shift the letter above it. The same letter in the message becomes different letters depending on where it lands.',
          'It held out for about three hundred years until Kasiski noticed that repeated chunks in the message reveal the length of the key.'
        ]
      },
      xor: {
        tag: 'The building block of everything modern',
        steps: [
          'Both the message and the key become raw bytes.',
          'Each byte of the message is combined with a byte of the key using exclusive or: matching bits become zero, differing bits become one.',
          'Doing it twice with the same key gives the original back. Modern ciphers are built on this, but with a key as long as the message and never reused.'
        ]
      },
      atbash: {
        tag: 'Hebrew scribes, before Rome existed',
        steps: [
          'Write the alphabet forwards, then again backwards underneath it.',
          'Swap every letter for the one below it. A becomes Z, B becomes Y.',
          'There is no key at all, so anyone who recognises the pattern reads it instantly. It appears in the Book of Jeremiah.'
        ]
      },
      rot13: {
        tag: 'Not security, just a curtain',
        steps: [
          'It is Caesar with the shift locked at thirteen.',
          'Thirteen is half of twenty six, so applying it twice returns the original. One button does both jobs.',
          'It was never meant to protect anything. It hides spoilers and punchlines so your eye does not catch them by accident.'
        ]
      },
      base64: {
        tag: 'Not a cipher at all',
        steps: [
          'Bytes are read three at a time, which is twenty four bits.',
          'Those twenty four bits are cut into four groups of six, and each group picks a character from a table of sixty four.',
          'This hides nothing. It exists so binary data can travel through channels that only accept text. It is on this shelf so you can tell the difference.'
        ]
      },
      morse: {
        tag: 'Not secrecy, but speed',
        steps: [
          'Each letter becomes a pattern of short and long marks.',
          'The most common letters get the shortest patterns. E is a single dot, which is why it beat every competing code on the telegraph.',
          'Anyone with the table reads it. It was built to travel down a wire, not to keep a secret.'
        ]
      },
      a1z26: {
        tag: 'The first cipher every kid invents',
        steps: [
          'A is one, B is two, and so on to Z at twenty six.',
          'Numbers are separated by spaces, and a slash marks where a word ends. It hides nothing, but it turns letters into arithmetic, which is where every serious cipher begins.'
        ]
      },
      railfence: {
        tag: 'Nothing is replaced, only moved',
        steps: [
          'Write the message zigzagging down and up across three lines, one letter per step.',
          'Then read it line by line, top to bottom. The letters are all still there, just in a different order. This is transposition, the other half of classical cryptography.'
        ]
      },
      polybius: {
        tag: 'Greece, second century BC',
        steps: [
          'Draw a five by five square and fill it with the alphabet. I and J share a cell, because twenty six letters do not fit in twenty five boxes.',
          'Each letter becomes its row and column. Polybius invented it to send messages with torches, one hand for the row and one for the column.'
        ]
      },
      binary: {
        tag: 'What the machine actually reads',
        steps: [
          'Each character becomes a byte, and each byte becomes eight ones and zeros.',
          'Nothing is hidden here. This is what is under the lens on this page: the same painting, written the way a computer holds it.'
        ]
      },
      hex: {
        tag: 'Binary, but readable by a human',
        steps: [
          'Each byte becomes two characters from zero to f, counting in sixteens instead of tens.',
          'It is the same data as binary, four times shorter. Every colour on this site is written this way.'
        ]
      },
      playfair: {
        tag: 'London, 1854',
        steps: [
          'Your key fills a five by five grid, then the rest of the alphabet follows. I and J share a cell.',
          'Letters are taken two at a time. Same row, each moves right. Same column, each moves down. Otherwise they swap columns and stay in their rows.',
          'It was the first cipher to work on pairs instead of single letters, which kills simple frequency counting. The British used it through both world wars.'
        ]
      },
      bacon: {
        tag: 'The message hidden in the typeface',
        steps: [
          'Each letter becomes five marks, either A or B, counting in binary three centuries before binary had a name.',
          'The trick was that the marks did not have to be letters. Bacon printed them as two slightly different typefaces, so an innocent paragraph carried a second message inside its own shapes.'
        ]
      },
      affine: {
        tag: 'Caesar with multiplication',
        steps: [
          'Each letter becomes a number, gets multiplied, then has a number added, all counted around a circle of twenty six.',
          'The multiplier cannot share a factor with twenty six, or two different letters land on the same one and nothing comes back. That is why only ten multipliers work.'
        ]
      },
      scytale: {
        tag: 'Sparta, fifth century BC',
        steps: [
          'A strip of leather is wound around a rod and the message written along it, then unwound. The letters end up scattered.',
          'Only a rod of exactly the same thickness lines them up again. The key is not a word, it is an object, which is the whole idea.'
        ]
      },
      rot47: {
        tag: 'ROT13 for programmers',
        steps: [
          'It takes the entire visible ASCII range, ninety four characters counting digits and punctuation, and moves each one forty seven places.',
          'Forty seven is half of ninety four, so applying it twice returns the original, exactly like ROT13. It hides symbols too, which ROT13 leaves untouched.'
        ]
      },
      base32: {
        tag: 'Made to be read out loud',
        steps: [
          'Bits are read five at a time and each group picks from thirty two characters: the alphabet plus the digits two through seven.',
          'Zero, one, eight and nine were left out on purpose, because they get confused with O, I, B and g. That is why your two factor backup codes use it.'
        ]
      },
      ascii: {
        tag: 'The number behind every letter',
        steps: [
          'Every character already is a number inside the machine. A is sixty five, a is ninety seven, a space is thirty two.',
          'This just shows those numbers. It is where the XOR and everything modern actually starts working.'
        ]
      },
      nato: {
        tag: 'Built for a bad radio',
        steps: [
          'Each letter becomes a word chosen so it survives static, an accent and a bad connection.',
          'It is not a cipher, it is the opposite: it exists so nothing is ever misunderstood. It is on the shelf because clarity and secrecy are the two ends of the same problem.'
        ]
      },
      tap: {
        tag: 'Written on a prison wall',
        steps: [
          'The alphabet goes into a five by five grid, then each letter becomes taps: the row, a pause, the column.',
          'Prisoners of war used it through walls, where a voice would be heard but a knuckle would not. C is tapped as K, since the grid holds only twenty five letters.'
        ]
      },
      braille: {
        tag: 'Written to be read by hand',
        steps: [
          'Six raised dots, in a pattern per letter. Louis Braille built it at fifteen, from a military code for reading orders in the dark.',
          'It is not secrecy either. It is the same idea as every cipher on this shelf: one meaning carried in a different set of shapes.'
        ]
      },
      sha256: {
        tag: 'One way street',
        steps: [
          'It chews the whole file and spits out sixty four characters. The same file always gives the same result, and there is no way back.',
          'Change one bit of the file and roughly half the output bits change. That is what lets it prove a download arrived intact.',
          'It is not encryption. It cannot be undone, which is exactly the point.'
        ]
      },
      sha512: {
        tag: 'The heavier brother',
        steps: [
          'Same idea as SHA-256, but working in sixty four bit words and giving one hundred and twenty eight characters out.',
          'On a sixty four bit machine it is often faster than SHA-256, which surprises most people.'
        ]
      },
      sha1: {
        tag: 'Broken, and kept here as a warning',
        steps: [
          'It served the whole web for twenty years, signing certificates and Git commits.',
          'In 2017 Google produced two different PDFs with the same SHA-1. Once you can do that, the fingerprint proves nothing. It stays on the shelf so you can see what a retired algorithm looks like.'
        ]
      }
    }
  },

  errors: {
    'wrong-password': 'That password does not open this file.',
    'not-our-file': 'This file was not sealed here.',
    'bad-version': 'This file came from a newer version of the site.',
    'file-too-big': 'This file is over 512 MB, which is more than the browser can hold.',
    'image-too-small':
      'This photo is too small for that secret. Use a bigger image or a shorter secret.',
    'nothing-hidden':
      'There is nothing hidden in this photo. Either it never carried a secret, or it was resized or recompressed along the way.',
    corrupted: 'The file is damaged and cannot be read to the end.',
    unknown: 'Something broke on the way. Try again.',
    retry: 'Try again'
  },

  footer: {
    tag: 'Built in the open, one file at a time.',
    privacy: 'Privacy',
    terms: 'Terms',
    cookies: 'Cookies',
    source: 'Source code'
  },

  notFound: {
    title: 'This page was never sealed.',
    text: 'The address exists in your head but not on this site.',
    cta: 'Back to the start'
  },

  legal: {
    updated: 'Last updated',
    date: 'August 2026',
    privacy: {
      title: 'Privacy',
      lead: 'The short version: your files never leave your computer, so there is nothing here for us to collect.',
      blocks: [
        {
          h: 'Your files',
          p: 'Encryption and decryption run inside your browser using the Web Crypto API. No file, no password and no result is ever sent to a server. There is no upload endpoint in this project.'
        },
        {
          h: 'Your password',
          p: 'The password lives in the memory of the browser tab while the work runs and is discarded when you leave or reload the page. It is not stored, not logged and not recoverable. If you forget it, the file cannot be opened by anyone, us included.'
        },
        {
          h: 'What is stored on your device',
          p: 'Three items in localStorage: your chosen language, the light or dark theme, and whether you already dismissed the warning about losing your password. That is all. No account, no session, no tracking identifier.'
        },
        {
          h: 'Talking to us',
          p: 'If you send an email, that email is on the mail provider, not here. Nothing you do on the site is linked to it.'
        }
      ]
    },
    terms: {
      title: 'Terms of use',
      lead: 'Free to use, offered as is, with one risk you need to understand before you start.',
      blocks: [
        {
          h: 'There is no recovery',
          p: 'This is the important one. The password is the only key. There is no reset link, no backup copy and no back door. If you lose the password, the encrypted file is lost permanently. Test with a copy before you trust it with the only version of something.'
        },
        {
          h: 'No warranty',
          p: 'The site is provided as is, without warranty of any kind. It is a personal project, not an audited security product. Do not use it as the only protection for something whose loss you cannot afford.'
        },
        {
          h: 'Your responsibility',
          p: 'You are responsible for what you encrypt and for keeping your own backups. Do not use the site for anything illegal where you live.'
        },
        {
          h: 'Changes',
          p: 'The file format carries a version number, so files produced by older versions keep opening. If that ever has to change, it will be announced on this page first.'
        }
      ]
    },
    cookies: {
      title: 'Cookies',
      lead: 'This site does not use cookies. That is the whole policy, but here is the detail.',
      blocks: [
        {
          h: 'No cookies at all',
          p: 'No advertising cookies, no analytics cookies, no session cookies. Nothing is written to document.cookie by this site, which is why you never saw a consent banner.'
        },
        {
          h: 'Three items in localStorage',
          p: 'The key cryptographer:lang stores whether you chose Portuguese or English, cryptographer:theme stores whether you left the lights on or off, and cryptographer:warn remembers that you already read the warning about losing your password, so it does not come back. All three are strictly functional, they never leave your browser, and you can clear them from your browser settings whenever you like.'
        }
      ]
    }
  }
}

export type Dict = typeof en
