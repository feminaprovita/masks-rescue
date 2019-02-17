const fs = require('fs');
const act = require('../scraped_ids/ids_act');
const anc = require('../scraped_ids/ids_anc');
const dis = require('../scraped_ids/ids_dis');
const fmc = require('../scraped_ids/ids_fmc');
const hlc = require('../scraped_ids/ids_hlc');
const lfg = require('../scraped_ids/ids_lfg');

const allIds = act.concat(anc).concat(dis).concat(fmc).concat(hlc).concat(lfg);

// console.log(allIds)
fs.writeFileSync('./ids_all_2.json', JSON.stringify(allIds, undefined, 2));
