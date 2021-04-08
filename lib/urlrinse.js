// remove param strings
const removeParam = (u) => u.split('?')[0]

// clean param, split path
const split = (u) => removeParam(u).split('/')

// unshorten with node https
const unshortP = (u, resolve, err) => require('https').get(u, (res) => res.headers.location ? unshortP(res.headers.location, resolve, err) : resolve(u))

// unshorten
const unshorten = async (u) => new Promise((res, err) => unshortP(u, res, err))

// unshorten with window.fetch
async function swUnshorten(u) {
  const res = await fetch(u)
  return res.url
}

// reconstruct reddit URL
function reddit(u) {
  const part = split(u)
  return part[8] ? `https://reddit.com/comments/${part[6]}/c/${part[8]}` : `https://redd.it/${part[6]}`
}

// extract amazon ASIN
const getASIN = (u) => u.match('(?:/dp/|/gp/product/)([^/]+)')[1]

// reconstruct amazon URL
const amazon = (u) => `https://${split(u)[2]}/dp/${getASIN(u)}`

// Dereferrs url with anonym.to
const defer = (url) => `https://anonym.to/?${url}`

module.exports = { removeParam, unshorten, swUnshorten, defer, reddit, amazon }
