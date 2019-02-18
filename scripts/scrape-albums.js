const fs = require('fs');
const puppeteer = require('puppeteer');
const photoAlbumUrlArr = require('../scraped/photo_urls.js');
// const photoAlbumUrlArr = [{
//     "id": "z134ilpgrx3ys3btn23rzz4ybuztyzwhg04",
//     "albumUrl": "https://plus.google.com/photos/106484838480275093774/albums/6656816116626649713?authkey=CO6M8uey3ZiIugE&sqi=110704683035976001273&sqsi=6c5e852a-c1c7-4b97-bbb7-e50f4f40c81e"
//   },
//   {
//     "id": "z13psnagoomzfrled221szbhpnepvlgsh",
//     "albumUrl": "https://plus.google.com/photos/111340090812572942195/albums/6654070343275669585?authkey=COKzlfLf4f6r9QE&sqi=110704683035976001273&sqsi=eed88ea0-6766-4b45-b207-2256408f0a6a"
//   },
//   {
//     "id": "z134yb4wzm2ozvccu23std0zlzbevppvw",
//     "albumUrl": "https://plus.google.com/photos/100309716718451042779/albums/6651952386161341697?authkey=CP7VtKDYufSn1wE&sqi=110704683035976001273&sqsi=6c5e852a-c1c7-4b97-bbb7-e50f4f40c81e"
//   }
// ]

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
  return result;
};

const slowDownAlbumScraping = async (arr,num=10) => {
  // console.log('length', arr.length);
  for (let i = 0; i < arr.length; i += num) {
    let portionToScrape = arr.slice(i,i+num);
    await Promise.all(portionToScrape.map(async e => {
      e.albumPhotoUrls = await scrape(e.albumUrl);
      // console.log('e after', e)
      return e;
    }));
  }
  console.log('module.exports = ', arr);
  // console.log('******************\n', arr);
  return arr;
}

slowDownAlbumScraping(photoAlbumUrlArr);

// const maybe = async () => {
//   const out = await slowDownAlbumScraping(photoAlbumUrlArr);
//   console.log('[', out, ']');
//   return out;
// }

// const ugh = maybe();

// fs.writeFileSync('./scraped/photo_urls.json', JSON.stringify(maybe, undefined, 2));
// fs.writeFileSync('./scraped/photo_urls.json', ugh);










// const extractItems = extractPhotoUrlsFromAlbums;

// const scrapeInfiniteScrollItems = async (page, extractItems, itemTargetCount, scrollDelay = 1000) => {
//   let items = [];
//   try {
//     let previousHeight;
//     while(items.length < itemTargetCount) {
//       items = items.concat(await page.evaluate(extractItems));
//       previousHeight = await page.evaluate('document.body.scrollHeight');
//       await page.evaluate('window.scrollTo(0,document.body.scrollHeight)');
//       await page.waitForFunction(`document.body.scrollHeight > ${previousHeight}`);
//       await page.waitFor(scrollDelay);
//     }
//   } catch(e) { console.log(e) }
//   return Array.from(new Set(items));
// }

// photoAlbumUrlArr.map(masksUrl => {
//   (async () => {
//     const browser = await puppeteer.launch({
//       headless: false,
//       args: ['--no-sandbox', '--disable-setuid-sandbox'],
//     });
//     const page = await browser.newPage();
//     page.setViewport({ width:1280, height: 926 });
//     await page.goto(masksUrl);
//     const items = await scrapeInfiniteScrollItems(page, extractItems,1000000);
//     fs.writeFileSync('../scraped_ids/ids_hlc.json', JSON.stringify(items, undefined, 2));
//     await browser.close();
//   })();
// })





