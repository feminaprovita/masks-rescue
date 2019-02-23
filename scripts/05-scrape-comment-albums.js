const puppeteer = require('puppeteer');

const scrape = async (url) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url);
  const result = await page.evaluate(() => {
    if(document.querySelectorAll('.jBMwef').length) {
      document.querySelectorAll('.jBMwef')[0].click()
    }
    const extractedElements = Array.from(document.querySelectorAll('.e8zLFb.GSnotf'));
    return extractedElements.map(el => el.getAttribute('jsdata').split(';')[1]);
  });
  await browser.close();
  // console.log('RESULT', result);
  return result;
};

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
          let urlArr = await scrape(e.url)
          if(garbageIndices.length !== urlArr.length) {
            console.log('HELP!!!!', e.url)
            e.garbageUrlFailure = true;
          } else {
            // console.log(urlArr.length, urlArr)
            garbageIndices.forEach((i, idx) => {
            e.comments[i].commentAttachment = { albumPhotoUrls: [urlArr[idx]] }

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
