const fs = require('fs');
const puppeteer = require('puppeteer');
const masksUrl = require('./feeder');

const extractIds = () => {
  let extractedElements = document.querySelectorAll('.aJZAlb.pYN4db.vCjazd')
  const items = [];
  for (let element of extractedElements) {
    items.push(element.getAttribute('data-iid'));
  }
  return items;
}

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
  const items = await scrapeInfiniteScrollItems(page, extractIds,1000000);
  fs.writeFileSync('../scraped_ids/ids_hlc.json', JSON.stringify(items, undefined, 2));
  await browser.close();
})();





