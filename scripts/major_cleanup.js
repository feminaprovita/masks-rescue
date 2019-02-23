const fs = require('fs')

module.exports = (inputJ, outputJ) => {
  let pud = fs.readFileSync(inputJ, 'utf8')
  let cleaned = pud

  console.log(new Set(cleaned.match(/<.*?[\s,>]/g)))

  cleaned = cleaned.replace(/data-.*?\\\".*?\\\"/g, '')
  cleaned = cleaned.replace(/class=\\\"ot-anchor\\\"/g, '')
  cleaned = cleaned.replace(/<span class=\\"proflinkWrapper\\">(.*?>){3}(.*?)<\/a><\/span>/g, '+$2')

  console.log(new Set(cleaned.match(/<.*?[\s,>]/g)))

  cleaned = cleaned.replace(/\s+/g,' ')
  cleanedObj = JSON.parse(cleaned)

  outObj = []
  cleanedObj.forEach(post => {
    let garbageCount = 0
    if (post.comments) post.comments.forEach(c => {
      const r = /<i><a href=\"https:\/\/plus.google.com\/legacy_photo_redirect\"\s*?>(.*?)<\/a><\/i>/
      if (r.test(c.content)) {
        garbageCount ++
        // Note that this is different from r above
        let link = c.content.replace(/.*?<i><a href=\"https:\/\/plus.google.com\/legacy_photo_redirect\"\s*?>(.*?)<\/a><\/i>.*?/, '$1')
        c.content = c.content.replace(r, '[attachment]')
        // console.log(link)
        // console.log(c.content)
        let key = link === 'https://plus.google.com/photos/...' ? 'garbageUrl' : 'photoUrl'
        c.attachmentsPlus = [{[key]: link}]
        // garbage might be findable with document.querySelectorAll('.e8zLFb.GSnotf')

      }
    })
    if (garbageCount) console.log('gc', garbageCount)
  })

  console.log(cleanedObj.length)

  fs.writeFileSync(outputJ, JSON.stringify(cleanedObj, undefined, 2))

}
