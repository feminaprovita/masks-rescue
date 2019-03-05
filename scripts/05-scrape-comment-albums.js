const { scrapePageByUrl } = require('./utils')

const extractAllCommentAttachments = () => {
  if(document.querySelectorAll('.jBMwef').length) {
    document.querySelectorAll('.jBMwef')[0].click()
  }
  const extractedElements = Array.from(document.querySelectorAll('.e8zLFb.GSnotf'));
  return extractedElements.map(el => el.getAttribute('jsdata').split(';')[1]);
}

const batchCommentScraping = async (arr,num=10) => {
  for (let i = 0; i < arr.length; i += num) {
    let portionToScrape = arr.slice(i,i+num);
    await Promise.all(portionToScrape.map(async e => {
      if(e.comments && e.comments.length) {
        let garbageIndices = e.comments.reduce((acc,cur,idx) => {
          if(cur.commentAttachment && cur.commentAttachment.garbageUrl) acc.push(idx)
          return acc
        },[])
        if(garbageIndices.length) {
          let urlArr = await scrapePageByUrl(e.url, extractAllCommentAttachments)
          if(garbageIndices.length !== urlArr.length) {
            console.log('HELP!!!!', e.url, `\ngarbageIndices.length: ${garbageIndices.length}, urlArr.length: ${urlArr.length}, \n`, urlArr)
            console.log(e.comments)
            e.garbageUrlFailure = true;
          } else {
            // console.log(urlArr.length, urlArr)
            garbageIndices.forEach((j, idx) => {
            e.comments[j].commentAttachment = { albumPhotoUrls: [urlArr[idx]] }

            })
          }
        }
      }
      return e;
    }));
  }
  return arr;
}

module.exports = batchCommentScraping
