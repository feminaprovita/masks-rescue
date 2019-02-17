const fs = require('fs');
const puppeteer = require('puppeteer');

// const masksUrl = 'https://plus.google.com/communities/110704683035976001273';
// const masksUrl = 'https://plus.google.com/communities/110704683035976001273/stream/de03a9ef-72af-4e7f-9222-d89521a5c534'; // announcements
// const masksUrl = 'https://plus.google.com/communities/110704683035976001273/stream/eed88ea0-6766-4b45-b207-2256408f0a6a'; // discussion
// const masksUrl = 'https://plus.google.com/communities/110704683035976001273/stream/6c5e852a-c1c7-4b97-bbb7-e50f4f40c81e'; // actual play
// const masksUrl = 'https://plus.google.com/communities/110704683035976001273/stream/15fb5f2e-3104-405f-84b0-85c75ddb7d5a'; // Fan Made Content
// const masksUrl = 'https://plus.google.com/communities/110704683035976001273/stream/1699a1f7-00a0-446b-92e7-a68956dd9df2'; // looking for game
const masksUrl = 'https://plus.google.com/communities/110704683035976001273/stream/f2d8ee4d-e2f1-48ae-bc35-eb35ef63676a'; // halcyonians

const extractUrls = () => {
  // let extractedElements = Array.from(document.querySelectorAll('.o8gkze')).concat(Array.from(document.querySelectorAll('.eZ8gzf')));
  let extractedElements = Array.from(document.querySelectorAll('.eZ8gzf'));
  //document.querySelector('.aJZAlb.pYN4db.vCjazd')
  //x[0].getAttribute('data-iid')
  const items = [];
  for (let element of extractedElements) {
    items.push(element.href);
  }
  return items;
}

const extractIds = () => {
  let extractedElements = document.querySelectorAll('.aJZAlb.pYN4db.vCjazd')
  const items = [];
  for (let element of extractedElements) {
    items.push(element.getAttribute('data-iid'));
  }
  return items;
}

const extractItems = extractIds;
// why??

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





