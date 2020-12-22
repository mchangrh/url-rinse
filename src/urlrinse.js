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

async function unshorten(url) {
    return new Promise((resolve, reject) => unshortenPromise(url, resolve, reject))
}

function defer(url) {
    return `https://anonym.to/?${url}`
}

module.exports = {
    removeQuery,
    unshorten,
    defer
}
