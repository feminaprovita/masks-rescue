const masksUrl = require('./scripts/feeder');
const scrapeIds = require('./scripts/01-scrape-ids')
const fetchDataById = require('./scripts/02-fetch-data-by-id')
const processComments = require('./scripts/03-process-comments')
const scrapeAlbums = require('./scripts/04-scrape-albums')
const scrapeCommentAlbums = require('./scripts/05-scrape-comment-albums')
const scrapePhotoPages = require('./scripts/06-scrape-photo-pages')
const imageDl = require('./scripts/07-image-dl.js/index.js')


// scrapeIds('https://plus.google.com/communities/110704683035976001273/stream/f2d8ee4d-e2f1-48ae-bc35-eb35ef63676a','ids_hlc.json')

// fetchDataById('./res/1.json', './res/2.json')
// processComments('./outputs/2_act_comm.json', './res/3.json')
// scrapeAlbums('./res/3.json', './res/4.json')
// scrapeCommentAlbums('./res/4.json', './res/5.json')
// scrapePhotoPages('./outputs/5_comments_linkified.json', './res/6.json')
// scrapePhotoPages('./scratch/test.json', './scratch/test-output.json')
imageDl('./outputs/6_photo_urls_direct.json', './scratch/idc-7.json', './img')

