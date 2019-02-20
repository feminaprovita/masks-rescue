const fs = require('fs');
const puppeteer = require('puppeteer');
const latestProcessedObj = require('../outputs/albums_half_processed.json')
// const latestProcessedObj = require('../scratch/feeder-b.json')

const scrape = async (url) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url);
  const result = await page.evaluate(() => {
    let photoDownload = document.querySelectorAll('.nKtIqb.GOVOFb')[0].dataset.dlu;
    return photoDownload;
  });
  await browser.close();
  return result;
};

const slowDownSimple = async(arr,num=10) => {
  let output = [];
  for (let i = 0; i < arr.length; i += num) {
    let portionToScrape = arr.slice(i,i+num);
    output = output.concat(await Promise.all(portionToScrape.map(scrape)).catch(e => ['plusError: ' + e.message]));
  }
  return output;
}

const lagoda = async objArr => {
  let output = [];
  for (let i = 0; i < objArr.length; i++) {
    console.log(i);
    let post = objArr[i];
    if(post.attachmentsPlus && post.attachmentsPlus[0].photoPageUrls) {
      let x = await slowDownSimple(post.attachmentsPlus[0].photoPageUrls).catch(e => ['plusError2: ' + e.message]);
      post.attachmentsPlus = [];
      x.forEach(y => {
        post.attachmentsPlus.push({photoUrl: y})
      })
    }
    output.push(post);
  }
  return output;
}

lagoda([...latestProcessedObj]).then(output => {
  fs.writeFileSync('./scraped/photo_urls_direct.json', JSON.stringify(output, undefined, 2));
})
