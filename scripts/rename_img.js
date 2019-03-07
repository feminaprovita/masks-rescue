/*
COMMENTED OUT LEST SOMEONE ACCIDENTALLY RENAME THINGS IN THEIR FILESYSTEM

const fs = require('fs')

let newFilenames = fs.readdirSync('./').map(imgFile => {
  let filenameArr = imgFile.split('.')
  filenameArr[1] = filenameArr[1].toLowerCase()
  if(filenameArr[1] === 'jpeg') filenameArr[1] = 'jpg'
  let out = filenameArr.join('.')
  fs.renameSync(`./${imgFile}`,`./${out}`)
  return out
})
console.log('all extensions:', Array.from(new Set(newFilenames.map(x => x.split('.')[1]))))
*/
