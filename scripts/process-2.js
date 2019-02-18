var fs = require('fs')

const contents = fs.readFileSync('./outputs/posts_processed.json', 'utf8')
const albumPhotos = fs.readFileSync('./scraped/photo_urls.json', 'utf8')

const x = JSON.parse(contents)
const posts = [...x]
const y = JSON.parse(albumPhotos)
const photos = [...y]

// let diffCheck = [];
// const compare = (obj) => {
//   let pub = new Date(obj.published);
//   let upd = new Date(obj.updated);
//   return (upd - pub);
// }
// posts.forEach(i => {
//   if(i.published !== i.updated) diffCheck.push({id: i.id, diff: compare(i)});
//   if(i.comments) i.comments.forEach(j => {if(j.published !== j.updated) diffCheck.push({id: j.id, diff: compare(j)});})
// })
// fs.writeFileSync('./scratch/update-times.json', JSON.stringify(diffCheck, undefined, 2));

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

fs.writeFileSync('./scratch/feeder-d.json', JSON.stringify(posts, undefined, 2));
// console.log(posts);
