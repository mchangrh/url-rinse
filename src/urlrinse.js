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
 * Unshortens a link
 * @param {String} url - URL to unshorten
 * @param {callback} resolve - callback for resolve
 * @param {callback} reject - callback for reject
 */
function unshorten(url, resolve, reject) {
    // inspired by https://stackoverflow.com/a/62588602
    const https = require("https")
    https.get(url, (res) => {
        if (res.statusCode === 301 || res.statusCode === 302) {
            return get(res.headers.location, resolve, reject)
        }
        resolve(url)
    })
}

async function unshortenPromise(url) {
    return new Promise((resolve, reject) => get(url, resolve, reject))
}

module.exports.removeQuery = removeQuery()
module.exports.unshorten = unshortenPromise()
