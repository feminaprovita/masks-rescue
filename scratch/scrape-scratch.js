const filterObject = (o, fields) => {
  let out = {}
  fields.forEach(f => {
    out[f] = o[f]
   })
  return out
}


// let scrape = async () => {
//   const browser = await puppeteer.launch({headless: true});
//   const page = await browser.newPage();
//   console.log('wtf')
//   await page.goto('https://plus.google.com/114796030157507505095/posts/NAKZZoxgs1Y');

//   const result = await page.evaluate(() => {
//     console.log('running page.evaluate()')
//     let test = document.querySelector('.o8gkze')
//     // let easyContent = document.querySelector('.Dm8wYc');
//     // let photoPostUrl = document.querySelector('.eZ8gzf');
//     // let textPostUrl = document.querySelector('.o8gkze');
//     // let postId = document.querySelector('.aJZAlb.pYN4db.vCjazd')['data-iid'];
//     // return {photoPostUrl, textPostUrl, postId};
//     console.log('hi');
//     console.log(test);
//     return test;
//   });
//   await browser.close();
//   return result;
// }

// const getPic = async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto(masksUrl);
//   await page.screenshot({path: 'masks.png'});

//   await browser.close();
// }

// // getPic();

// scrape().then((value) => {
//   console.log(value);
// })
// // console.log(JSON.stringify(scrape(masksUrl)));


// const extractItems = () => {
//   const extractedElements = document.querySelectorAll('.o8gkze');
//   const items = [];
//   for (let element of extractedElements) {
//     items.push(element.href);
//   }
//   return items;
// }
