var fs = require('fs')

module.exports = (inputJ, outputJ) => {
  const contents = fs.readFileSync(inputJ, 'utf8')

  const x = JSON.parse(contents)
  const posts = [...x]

  let photos = [];

  posts.forEach(i => {
    i.attachmentsTbd = []
    if(i.attachmentsPlus && i.attachmentsPlus[0].albumUrl) {
      photos.push({id: i.id, albumUrl: i.attachmentsPlus[0].albumUrl});
    }
  })

  posts.forEach(i => {
    i.attachmentsTbd = []
    if(i.attachmentsPlus && i.attachmentsPlus[0].albumUrl) {
        photos.reduce((acc,cur) => {
          if(cur.id === i.id) {
            i.attachmentsPlus[0].photoPageUrls = cur.albumPhotoUrls;
          }
        }, null)
      }
    if(i.attachmentsTbd.length < 1) i.attachmentsTbd = undefined;
  })

  fs.writeFileSync(outputJ, JSON.stringify(posts, undefined, 2));
}
