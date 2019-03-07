const {readJsonFile, writeJsonFile} = require('./scripts/utils')
const url = require('./feeder');

const scrapeIds = require('./scripts/01-scrape-ids')
const fetchDataById = require('./scripts/02-fetch-data-by-id')
const processComments = require('./scripts/03-process-comments')
const scrapeAlbums = require('./scripts/04-scrape-albums')
const scrapeCommentAlbums = require('./scripts/05-scrape-comment-albums')
const scrapePhotoPages = require('./scripts/06-scrape-photo-pages')
const imageDl = require('./scripts/07-image-dl.js')

const masksIds = require('./outputs/masks_all_ids_20190306.json')
const bluebeardIds = require('./outputs/bluebeard_all_ids_20190304.json')
const epyllionIds = require('./outputs/epyllion_all_ids_20190305.json')
const urbanShadowsIds = require('./outputs/urban_shadows_all_ids_20190305.json')
const velvetGloveIds = require('./outputs/velvet_glove_all_ids_20190305.json')


const updateIds = (sourceUrl, oldPosts, outputIdFilename) => {
  scrapeIds(sourceUrl,100).then(x => {
    const oldIds = oldPosts.map(x => x.id)
    const newIds = x.filter(i => !oldIds.includes(i))
    writeJsonFile(outputIdFilename, newIds)
    return newIds
  })
}

const fetchAllIds = (sourceUrl, outputIdFilename) => {
  scrapeIds(sourceUrl).then(x => {
    writeJsonFile(outputIdFilename, x)
    return x
  })
}

const idsToPostsAndImages = (ids, outputFile, imageDir) => {
  fetchDataById(ids)
  .then(processComments)
  .then(scrapeAlbums)
  .then(scrapeCommentAlbums)
  .then(x => {
    writeJsonFile(outputFile, x)
    return x
  }).then(scrapePhotoPages)
  .then(x => imageDl(x,imageDir))
}

// fetchAllIds(url.masks_halcyonians, './scratch/masks_halcyonians_ids_20190306.json')

idsToPostsAndImages(masksIds, './outputs/masks_all_fullposts_20190306.json', './img/masks_20190306')
