const fs = require('fs');
const puppeteer = require('puppeteer');

const scrape = async (url) => {
  const browser = await puppeteer.launch({headless: true, timeout: 60000});
  const page = await browser.newPage();
  await page.goto(url, {timeout:55000});
  const result = await page.evaluate(() => {
    let photoDownloadNode = document.querySelectorAll('.nKtIqb.GOVOFb')[0]
    // document.querySelectorAll('.nKtIqb.GOVOFb')[0].children[1].src
    // let photoDownloadLink = document.querySelectorAll('.O84Olb')[0].getAttribute('data-iu')
    return photoDownloadNode.dataset.dlu || photoDownloadNode.children[1].src;
  });
  await browser.close();
  // console.log('RESULT', result)
  return result;
};

const batchScrape = async(arr,num=4) => {
  let output = [];
  for (let i = 0; i < arr.length; i += num) {
    let portionToScrape = arr.slice(i,i+num);
    output = output.concat(await Promise.all(portionToScrape.map(scrape)).catch(e => ['plusError: ' + e.message]));
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

module.exports = (inputJ, outputJ) => {
  getRealPhotoUrls(JSON.parse(fs.readFileSync(inputJ,'utf8'))).then(output => {
    fs.writeFileSync(outputJ, JSON.stringify(output, undefined, 2));
  })
}
