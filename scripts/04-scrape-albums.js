const { scrapePageByUrl } = require('./utils')

const getPhotoLinksFromAlbumPage = () => {
  const extractedElements = Array.from(document.querySelectorAll('.e6ttk'));
  const items = [];
  for (let element of extractedElements) {
    items.push(element.href);
  }
  return items;
}

const batchAlbumScraping = async (arr,num=10) => {
  for (let i = 0; i < arr.length; i += num) {
    let portionToScrape = arr.slice(i,i+num);
    await Promise.all(portionToScrape.map(async e => {
      if (e.attachmentsPlus && e.attachmentsPlus[0].albumUrl){
        e.attachmentsPlus[0].albumPhotoUrls = await scrapePageByUrl(e.attachmentsPlus[0].albumUrl, getPhotoLinksFromAlbumPage);
      }
      return e;
    }));
  }
  return arr;
}

module.exports = batchAlbumScraping
