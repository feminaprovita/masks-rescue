const fs = require('fs')
const puppeteer = require('puppeteer')

const sortPostsByDate = (a,b) => {
  let d1 = new Date(a.published)
  let d2 = new Date(b.published)
  return d1.getTime() === d2.getTime() ? 0 : (d1.getTime() > d2.getTime() ? -1 : 1)
}

const readJsonFile = (filename) => {
  return JSON.parse(fs.readFileSync(filename, 'utf8'))
}

const writeJsonFile = async (filename, promiseToWrite) => {
  fs.writeFileSync(filename, JSON.stringify(await promiseToWrite, undefined, 2))
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

const ScrapeInfiniteScrollByUrl = async (url, extractItems, maxItems=1000000) => {
  const browser = await puppeteer.launch({
    headless: false,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();
  page.setViewport({ width:1280, height: 926 });
  await page.goto(url);
  const items = await scrapeInfiniteScrollItems(page, extractItems, maxItems);
  await browser.close();
  return items;
}

const scrapePageByUrl = async (url, extractorFx, gotoOptions = {}) => {
  const browser = await puppeteer.launch({headless: true});
  const page = await browser.newPage();
  await page.goto(url, gotoOptions);
  const result = await page.evaluate(extractorFx);
  await browser.close();
//   console.log('RESULT', result);
  return result;
};


module.exports = {
  sortPostsByDate,
  readJsonFile,
  writeJsonFile,
  ScrapeInfiniteScrollByUrl, //cap was an accident please fix in vscode
  scrapePageByUrl
}
