const parseAndCleanup = require('./parse-and-cleanup')

module.exports = (posts) => {
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
              i.attachmentsPlus.push({photoUrl: a.url})
              // nb this may save an invalid filetype, in the end, so double-check
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
  return parseAndCleanup(JSON.stringify(posts, undefined, 2))
}
