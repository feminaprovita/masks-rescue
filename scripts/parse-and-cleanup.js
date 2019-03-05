const unescapeApostrophes = (str) => {
  return str.replace(/&#39;/gm, "'")
}

const parseAndCleanup = cleaned => {

  console.log(new Set(cleaned.match(/<.*?[\s,>]/g)))

  cleaned = cleaned.replace(/data-.*?\\\".*?\\\"/g, '')
  cleaned = cleaned.replace(/class=\\\"ot-anchor\\\"/g, '')
  cleaned = cleaned.replace(/<span class=\\"proflinkWrapper\\">(.*?>){3}(.*?)<\/a><\/span>/g, '+$2')

  console.log(new Set(cleaned.match(/<.*?[\s,>]/g)))

  cleaned = cleaned.replace(/\s+/g,' ')
  cleaned = unescapeApostrophes(cleaned)

  let cleanedObj = JSON.parse(cleaned)

  cleanedObj.forEach(post => {
    let garbageCount = 0
    if (post.comments) post.comments.forEach(c => {
      const r = /<i><a href=\"https:\/\/plus.google.com\/legacy_photo_redirect\"\s*?>(.*?)<\/a><\/i>/
      const s = /<i><a href=\".*?https:\/\/plus\.google\.com\/photos\/\.\.\.<\/a><\/i>/
      if (r.test(c.content) || s.test(c.content)) {
        garbageCount ++
        if(s.test(c.content)) {
          c.content = c.content.replace(s, '[attachment]')
          c.commentAttachment = {garbageUrl: true}
        } else {
          let link = c.content.replace(/.*?<i><a href=\"https:\/\/plus.google.com\/legacy_photo_redirect\"\s*?>(.*?)<\/a><\/i>.*?/, '$1')
          c.content = c.content.replace(r, '[attachment]')
          // c.commentAttachment = {photoUrl: link}
          c.commentAttachment = {garbageUrl: true}
        }
      }
    })
    if (garbageCount) console.log('gc', garbageCount)
  })

  console.log(cleanedObj.length)

  return cleanedObj
}

module.exports = parseAndCleanup
