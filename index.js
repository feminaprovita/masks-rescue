const {readJsonFile, writeJsonFile} = require('./scripts/utils')
const url = require('./feeder');
const scrapeIds = require('./scripts/01-scrape-ids')
const fetchDataById = require('./scripts/02-fetch-data-by-id')
const processComments = require('./scripts/03-process-comments')
const scrapeAlbums = require('./scripts/04-scrape-albums')
const scrapeCommentAlbums = require('./scripts/05-scrape-comment-albums')
const scrapePhotoPages = require('./scripts/06-scrape-photo-pages')
const imageDl = require('./scripts/07-image-dl.js')

const masksIds = require('./update/masks_all_new_ids_20190304.json')



const updateIds = (oldPosts, outputIdFilename) => {
  scrapeIds(url.masks_all,100).then(x => {
    const oldIds = oldPosts.map(x => x.id)
    const newIds = x.filter(i => !oldIds.includes(i))
    writeJsonFile(outputIdFilename, newIds)
    return newIds
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

fetchDataById()




// writeJsonFile('update/masks_all_ids.json',readJsonFile('outputs/5_comments_linkified.json').map(x => x.id))





// scrapeIds('https://plus.google.com/communities/110704683035976001273/stream/f2d8ee4d-e2f1-48ae-bc35-eb35ef63676a','ids_hlc.json')

// fetchDataById('./res/1.json', './res/2.json')
// processComments('./outputs/2_act_comm.json', './res/3.json')
// scrapeAlbums('./res/3.json', './res/4.json')
// scrapeCommentAlbums('./res/4.json', './res/5.json')
// scrapePhotoPages('./outputs/5_comments_linkified.json', './res/6.json')
// scrapePhotoPages('./scratch/test.json', './scratch/test-output.json')
// imageDl('./outputs/6_photo_urls_direct.json', './scratch/idc-7.json', './img')

