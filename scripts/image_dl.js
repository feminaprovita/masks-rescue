const fs = require('fs')
const https = require('https')

let u = 'https://lh3.googleusercontent.com/-D3B_DAZMsIg/XCHg1khea_I/AAAAAAAAAbE/7WEuZeexNnwDR-LzFN94F9416RzwZJ7owCJoC/w523-h832/001'

let u2 = 'https://lh3.googleusercontent.com/-4ym9K6ONzo0/XBtB-5J51eI/AAAAAAAAAJk/9ZyVIxRm1XsQRx9C9rGWIikaatZTeGQBACJoC/w1299-h1053/chloebio.jpg'

const getImage = (url, fn = 't') => {
  let ext
  if (url.slice(-6).includes('.')) {
    ext = url.slice(-6).split('.').slice(-1)[0]
  }
  https.get(url, (res) => {
    let mime = res.headers['content-type']
    if (!ext) ext = mime || ''
    ext = ext.replace('image/', '')
    ext = ext.replace('/', '_')
    console.log(ext)
    let file = fs.createWriteStream(`./${fn}.${ext}`)
    res.pipe(file)
    file.on('finish', () => {
      file.close()
    })
  })
}

getImage(u)
