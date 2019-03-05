const {ScrapeInfiniteScrollByUrl} = require('./utils')

const extractIds = () => {
  let extractedElements = document.querySelectorAll('.aJZAlb.pYN4db.vCjazd')
  const items = [];
  for (let element of extractedElements) {
    items.push(element.getAttribute('data-iid'));
  }
  return items;
}

module.exports = async (url, maxItems=1000000) => {
  return await ScrapeInfiniteScrollByUrl(url, extractIds, maxItems)
}
