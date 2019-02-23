const fs = require('fs');
const puppeteer = require('puppeteer');

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

module.exports = (async (url, outputJ, maxItems=1000000) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width:1280, height: 926 });
  await page.goto(url);
  const items = await scrapeInfiniteScrollItems(page, extractIds,maxItems);
  fs.writeFileSync(outputJ, JSON.stringify(items, undefined, 2));
  await browser.close();
});
