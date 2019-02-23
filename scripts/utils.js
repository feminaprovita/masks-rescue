const sortPostsByDate = (a,b) => {
  let d1 = new Date(a.published)
  let d2 = new Date(b.published)
  return d1.getTime() === d2.getTime() ? 0 : (d1.getTime() > d2.getTime() ? -1 : 1)
}

module.exports = {
  sortPostsByDate
}
