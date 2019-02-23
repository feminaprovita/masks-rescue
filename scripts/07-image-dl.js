const fs = require('fs')
const https = require('https')

// let u = 'https://lh3.googleusercontent.com/-D3B_DAZMsIg/XCHg1khea_I/AAAAAAAAAbE/7WEuZeexNnwDR-Lzfilename94F9416RzwZJ7owCJoC/w523-h832/001'

// let u2 = 'https://lh3.googleusercontent.com/-4ym9K6ONzo0/XBtB-5J51eI/AAAAAAAAAJk/9ZyVIxRm1XsQRx9C9rGWIikaatZTeGQBACJoC/w1299-h1053/chloebio.jpg'

const getImage = (url, filename = 't') => {
  return new Promise((resolve,reject) => {
    let ext
    if (url.slice(-6).includes('.')) {
      ext = url.slice(-6).split('.').slice(-1)[0]
    }
    https.get(url, (res) => {
      let mime = res.headers['content-type']
      if (!ext) ext = mime || ''
      ext = ext.replace('image/', '')
      ext = ext.replace('/', '_')
      // console.log(ext)
      let file = fs.createWriteStream(`${filename}.${ext}`)
      res.pipe(file)
      file.on('finish', () => {
        file.close()
        resolve(0)
      })
    })
  })
}

module.exports = async (inputJ, outputJ, outputDir) => {
  const scrape = async (post, pIdx) => {
    if(pIdx === -1) return;
    console.log(pIdx)
    if(post.attachmentsPlus) {
      await Promise.all(post.attachmentsPlus.map(async (a, idx) => {
        if(a.photoUrl) {
          await getImage(a.photoUrl, `${outputDir}/${post.id}-a${idx}`)
        }
      }))
    }
    if(post.comments) {
      await Promise.all(post.comments.map(async (c, idx) => {
        console.log(`${pIdx}.${idx}`)
        if(c.commentAttachment) {
          if(c.commentAttachment.photoUrl) {
            // should delete above line after catch error
            await getImage(c.commentAttachment.photoUrl, `${outputDir}/${post.id}-c${idx}`)
          }
        }
      }))
    }
  }
  let posts = JSON.parse(fs.readFileSync(inputJ,'utf8'))
  let num = 50
  for (let i = 0; i < posts.length; i += num) {
    console.log('post index:', i)
    let portionToScrape = posts.slice(i,i+num);
    await Promise.all(portionToScrape.map(scrape));
  }
}
