const masksUrl = require('./scripts/feeder');
const scrapeIds = require('./scripts/01-scrape-ids')
const fetchDataById = require('./scripts/02-fetch-data-by-id')
const processComments = require('./scripts/04-process-comments')
const scrapeAlbums = require('./scripts/05-scrape-albums')
const processAlbums = require('./scripts/06-process-albums')


// scrapeIds('https://plus.google.com/communities/110704683035976001273/stream/f2d8ee4d-e2f1-48ae-bc35-eb35ef63676a','ids_hlc.json')

// fetchDataById('./res/1.json', './res/2.json')
// processComments('./res/2.json', './res/4.json')
scrapeAlbums('./res/4.json', './res/5.json')
// processAlbums('./res/4.json', './res/6.json')
