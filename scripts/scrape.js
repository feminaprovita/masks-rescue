const fs = require('fs');
const puppeteer = require('puppeteer');
const masksUrl = require('./scraped/album-urls.json');

// const extractUrls = () => {
//   // let extractedElements = Array.from(document.querySelectorAll('.o8gkze')).concat(Array.from(document.querySelectorAll('.eZ8gzf')));
//   let extractedElements = Array.from(document.querySelectorAll('.eZ8gzf'));
//   //document.querySelector('.aJZAlb.pYN4db.vCjazd')
//   //x[0].getAttribute('data-iid')
//   const items = [];
//   for (let element of extractedElements) {
//     items.push(element.href);
//   }
//   return items;
// }

// const extractIds = () => {
//   let extractedElements = document.querySelectorAll('.aJZAlb.pYN4db.vCjazd')
//   const items = [];
//   for (let element of extractedElements) {
//     items.push(element.getAttribute('data-iid'));
//   }
//   return items;
// }

const extractPhotoUrlsFromAlbums = () => {
  let extractedElements = Array.from(document.querySelectorAll('.e6ttk'));
  const items = [];
  for (let element of extractedElements) {
    items.push(`https://plus.google.com${element.href}`);
  }
  return items;
}

const extractItems = extractPhotoUrlsFromAlbums;
// why?? i think this is lazy variable-ing

const scrapeInfiniteScrollItems = async (page, extractItems, itemTargetCount, scrollDelay = 1000) => {
  let items = [];
  try {
    let previousHeight;
    while(items.length < itemTargetCount) {
      items = items.concat(await page.evaluate(extractItems));
      previousHeight = await page.evaluate('document.body.scrollHeight');
      await page.evaluate('window.scrollTo(0,document.body.scrollHeight)');
      await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
      await page.waitFor(scrollDelay);
    }
  } catch(e) { console.log(e) }
  return Array.from(new Set(items));
}

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width:1280, height: 926 });
  await page.goto(masksUrl);
  const items = await scrapeInfiniteScrollItems(page, extractItems,1000000);
  fs.writeFileSync('../scraped_ids/ids_hlc.json', JSON.stringify(items, undefined, 2));
  await browser.close();
})();





