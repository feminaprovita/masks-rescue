const fs = require('fs');
const puppeteer = require('puppeteer');

const scrape = async (url) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url);
  const result = await page.evaluate(() => {
    const extractedElements = Array.from(document.querySelectorAll('.e6ttk'));
    const items = [];
    for (let element of extractedElements) {
      items.push(element.href);
    }
    return items;
  });
  await browser.close();
  console.log('RESULT', result);
  return result;
};

const slowDownAlbumScraping = async (arr,num=10) => {
  for (let i = 0; i < arr.length; i += num) {
    let portionToScrape = arr.slice(i,i+num);
    await Promise.all(portionToScrape.map(async e => {
      if (e.attachmentsPlus && e.attachmentsPlus[0].albumUrl){
        e.albumPhotoUrls = await scrape(e.attachmentsPlus[0].albumUrl);
      }
      return e;
    }));
  }
  return arr;
}

module.exports = (inputJ, outputJ) => {
  const posts = JSON.parse(fs.readFileSync(inputJ, 'utf8'))
  const output = slowDownAlbumScraping(posts)
  fs.writeFileSync(outputJ, JSON.stringify(output, undefined, 2));
}
