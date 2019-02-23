const fs = require('fs')

const sortPostsByDate = (a,b) => {
  let d1 = new Date(a.published)
  let d2 = new Date(b.published)
  return d1.getTime() === d2.getTime() ? 0 : (d1.getTime() > d2.getTime() ? -1 : 1)
}

const readJsonFile = (filename) => {
  return JSON.parse(fs.readFileSync(filename, 'utf8')) 
}

const writeJsonFile = (filename, objectToWrite) => {
  fs.writeFileSync(filename, JSON.stringify(objectToWrite, undefined, 2))
}

module.exports = {
  sortPostsByDate,
  readJsonFile,
  writeJsonFile
}
