// remove all query strings and parameter strings
const removeParam = (url) => url.replace(/&.*/, '').split('?')[0]

// removes query strings and splits into array
const split = (url) => removeParam(url).split('/')

// unshorten with node http | source: https://stackoverflow.com/a/62588602
function unshortenPromise(url, resolve, reject) {
require("https").get(url, (res) => {
    if (res.statusCode >= 300 && res.statusCode < 400) return unshortenPromise(res.headers.location, resolve, reject)
    resolve(url)
  })
}

// unshorten promise
async function unshorten(url) {
  return new Promise((resolve, reject) => unshortenPromise(url, resolve, reject))
}

// unshortens url with Service Worker fetch
async function swUnshorten (url) {
  const response = await fetch(url)
  return response.url
}

// reconstructs reddit URL
function reddit (url) {
  const parts = split(url)
  let newUrl = `https://reddit.com/comments/${parts[6]}`
  if (parts[8]) newUrl += `/c/${parts[8]}/`
  return newUrl
}

// extracts Amazon ASIN
function getASIN (url) {
  for (const regex of ['/(?:.+/)?dp/([^/?]+)/', '/gp/product/([^/?]+)/', '/ASIN/([^/?]+)/']) {
    const m = url.match(regex)
    if (m) return m[1]
  }
}

// reconstructs amazon URL
const amazon = (url) => `https://${split(url)[2]}/dp/${getASIN(url)}`

// Dereferrs url with anonym.to
const defer = (url) => `https://anonym.to/?${url}`

module.exports = { removeParam, unshorten, swUnshorten, defer, reddit, amazon }
