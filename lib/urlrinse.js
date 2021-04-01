/**
 * removes all queries and parameters
 * @param {String} url - URL to clean 
 */
function removeQuery(url) {
  const noQuery = url.replace(/&.*/, '') // remove all queries
  const noParam = noQuery.split('?') // split by parameter
  return noParam[0] // return first result from parameter split
}

/**
 * Removes query strings and splits URL
 * @param {String} url 
 * @returns {[String]} - Array of Strings
 */
function splitUrl(url) {
  return rinse.removeQuery(url).split("/")
}

/**
 * Unshortens a link
 * @param {String} url - URL to unshorten
 * @param {callback} resolve - callback for resolve
 * @param {callback} reject - callback for reject
 */
function unshortenPromise(url, resolve, reject) {
  const https = require("https")
  // inspired by https://stackoverflow.com/a/62588602
  https.get(url, (res) => {
    if (res.statusCode === 301 || res.statusCode === 302) {
      return unshortenPromise(res.headers.location, resolve, reject)
    }
    resolve(url)
  })
}

/**
 * Unshortens URL with node https
 * @param {String} url 
 * @returns String URL's final destination
 */
async function unshorten(url) {
  return new Promise((resolve, reject) => unshortenPromise(url, resolve, reject))
}

/**
 * Reconstructs reddit URL
 * @param {URL} url 
 * @returns {String} Reconstructed URL
 */
// source: https://reddit.com/comments/5524cd/c/d86w2uv/
function reddit(url) {
  const split = splitUrl(url)
  let newUrl = `https://reddit.com/comments/${split[6]}`
  if (split[8]) newUrl += `/c/${split[8]}/`
  return newUrl
}

/**
 * returns Amazon ASIN (Product ID)
 * @param {String} url 
 * @returns {String} extracted ASIN
 */
// cleaner from https://gist.github.com/frakman1/4a1ab7f89eaa2d2abe64f1ad38485620
function getASIN(url) {
  var m;
  const dpRegex = '/(?:.+\/)?dp\/([^/?]+)/'
  const gpRegex = '/gp\/product\/([^/?]+)/'
  const ASINRegex = '/ASIN\/([^/?]+)/'
  m = url.match(dpRegex)
  if (m) return m[1]
  m = url.match(gpRegex)
  if (m) return m[1]
  m = url.match(ASINRegex)
  if (m) return m[1]
}

/**
 * Reconstructs amazon URL
 * @param {String} url 
 * @returns {String} - Reconstructed URL
 */
function amazon(url) {
  const split = splitUrl(url)
  const ASIN = getASIN(url)
  return `https://${split[2]}/dp/${ASIN}`
}

/**
 * Unshortens URL with Service Worker "fetch"
 * @param {String} url 
 * @returns {String} URL's final destination
 */
async function swUnshorten(url) {
  const response = await fetch(url)
  return response.url
}

/**
 * Dereferrs url with anonym.to
 * @param {String} url 
 * @returns {String} Deferred url
 */
function defer(url) {
  return `https://anonym.to/?${url}`
}

module.exports = {
  reddit,
  amazon,
  removeQuery,
  unshorten,
  swUnshorten,
  defer
}
