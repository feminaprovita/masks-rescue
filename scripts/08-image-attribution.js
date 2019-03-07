const fs = require('fs')
const {writeJsonFile} = require('./utils')

const removeQuote = unparsedJsonStr => {
  return unparsedJsonStr.replace('&quot;',`\\"`)
}

const matchAttachmentsToFiles = (imageDir, arrOfPostObjs) => {
  let imageList = fs.readdirSync(imageDir)
  return arrOfPostObjs.map(x => {
    if(x.attachmentsPlus) {
      x.downloadedAttachments = []
      let attachmentCount = x.attachmentsPlus[0].photoUrl ? 1 : x.attachmentsPlus[0].albumPhotoUrls.length
      for(let i = 0; i < attachmentCount; i++) {
        x.downloadedAttachments.push(imageList.filter(it => it.startsWith(`${x.id}-a${i}`))[0])
      }
    }
    if(x.comments && x.comments.length) x.comments = x.comments.map((c, idx) => {
      if(c.commentAttachment && c.commentAttachment.albumPhotoUrls) {
        c.downloadedAttachments = [imageList.filter(it => it.startsWith(`${x.id}-c${idx}`))[0]]
      }
      return c
    })
    return x
  })
}

let contentString = fs.readFileSync('./outputs/masks_all_fullposts_20190306.json', 'utf8')
contentString = removeQuote(contentString)
const postObj = JSON.parse(contentString)
writeJsonFile('./outputs/masks_all_parsed_posts_20190306.json',matchAttachmentsToFiles('./img/masks_20190306', postObj))
