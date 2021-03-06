// remove param strings
let removeParam = (u) => u.split('?')[0]

// clean param, split path
let split = (u) => removeParam(u).split('/')

// unshorten w/ node https
let unshortP = (u,r,e) => require('https').get(u,(res) => res.headers.location ? unshortP(res.headers.location, r,e) : r(u))

// unshorten
let unshorten = async (u) => new Promise((r,e) => unshortP(u,r,e))

// unshorten w/ window.fetch
let swUnshorten = async (u) => {
  let res = await fetch(u)
  return res.url
}

// reconstruct reddit URL
let reddit = (u) => {
  let p = split(u)
  return `https://reddit.com/comments/${p[6]}${p[8] ? '/c/'+p[8] : ''}`
}

// extract amazon ASIN
let getASIN = (u) => u.match('(?:/dp/|/gp/product/)([^/]+)')[1]

// reconstruct amazon URL
let amazon = (u) => `https://${split(u)[2]}/dp/${getASIN(u)}`

// Derefers url with anonym.to
let defer = (u) => `https://anonym.to/?${u}`

// de-amp url
let deAmp = async (u) => {
  let nu = await swUnshorten(u)
  let b = await fetch(nu).then((r) => r.text())
  return (RegExp("<html (amp|⚡)",'i').test(b) ? b.match('<link(?: rel="canonical"| href=")+(.*?)"')[1] : nu)
}

module.exports = { removeParam,unshorten,swUnshorten,defer,reddit,amazon,deAmp }