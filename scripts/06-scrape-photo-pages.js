const { scrapePageByUrl } = require('./utils')

const extractDirectLinkFromPhotoPage = () => {
  let photoDownloadNode = document.querySelectorAll('.nKtIqb.GOVOFb')[0]
  return photoDownloadNode.dataset.dlu || photoDownloadNode.children[1].src;
}

const batchScrape = async(arr,num=4) => {
  let output = [];
  for (let i = 0; i < arr.length; i += num) {
    let portionToScrape = arr.slice(i,i+num);
    output = output.concat(await Promise.all(portionToScrape.map(u => scrapePageByUrl(u, extractDirectLinkFromPhotoPage, {timeout:55000}))).catch(e => ['plusError: ' + e.message]));
  }
  return output;
}

const getRealPhotoUrls = async objArr => {
  let output = [];
  for (let i = 0; i < objArr.length; i++) {
    console.log(i)
    let post = objArr[i];
    if(post.attachmentsPlus && post.attachmentsPlus[0].albumPhotoUrls) {
      let x = await batchScrape(post.attachmentsPlus[0].albumPhotoUrls).catch(e => ['plusError2A: ' + e.message]);
      post.attachmentsPlus = [];
      x.forEach(y => {
        post.attachmentsPlus.push({photoUrl: y})
      })
    }
    if(post.comments) {
      for (let c = 0; c < post.comments.length; c++) {
        console.log(`${i}.${c}`)
        if(post.comments[c].commentAttachment && post.comments[c].commentAttachment.albumPhotoUrls) {
          let x = await batchScrape(post.comments[c].commentAttachment.albumPhotoUrls).catch(e => ['plusError2C: ' + e.message]);
          // console.log(x.length,'x',x)
          post.comments[c].commentAttachment = {photoUrl: x[0]}
        }
      }
    }
    output.push(post);
  }
  return output;
}

module.exports = getRealPhotoUrls
