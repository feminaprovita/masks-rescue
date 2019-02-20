var fs = require('fs')

let contents = fs.readFileSync('../outputs/act_comm.json', 'utf8')

let out = contents.replace(/&#39;/gm, "'")

let posts = JSON.parse(out)

posts.forEach(i => {
  if (i.attachments) {
    i.attachmentsParsed = []
    i.attachmentsPlus = []
    i.attachmentsTbd = []
    i.attachments.forEach(a => {
      switch (a.objectType) {
        case 'event':
          i.attachmentsParsed.push({eventDisplayName: a.displayName, eventContent: a.content})
          break;
        case 'article':
          i.attachmentsParsed.push({url: a.url})
          break;
        case 'photo':
          i.attachmentsPlus.push({photoUrl: a.fullImage.url})
          break;
        case 'video':
          if (a.url.startsWith('https://plus.google.com'))
            i.attachmentsPlus.push({videoUrl: a.url})
          else i.attachmentsParsed.push({url: a.url})
          break;
        case 'album':
          i.attachmentsPlus.push({albumUrl: a.url})
          break;
        default:
          i.attachmentsTbd.push(a)
          break;
      }
    })
    i.attachments = undefined
    if (!i.attachmentsParsed.length) i.attachmentsParsed = undefined
    if (!i.attachmentsPlus.length) i.attachmentsPlus = undefined
    if (!i.attachmentsTbd.length) i.attachmentsTbd = undefined

  }
})
//{ 'album', 'article', 'photo', 'video', 'event' }
// album: url but it fucking hates you? todo.
// class 'e6ttk' in album links to photo page
// article: url
// photo: fullImage.url (download)
// video: url (download if it's google plus -- only one of these?!)
// event: displayname, content

posts.sort((a,b) => {
  let d1 = new Date(a.published)
  let d2 = new Date(b.published)
  return d1.getTime() === d2.getTime() ? 0 : (d1.getTime() > d2.getTime() ? -1 : 1)
})
fs.writeFileSync('../outputs/posts_processed.json', JSON.stringify(posts, undefined, 2));


