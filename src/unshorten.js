const https = require("https")

/**
 * Unshortens a link
 * @param {String} url - URL to unshorten
 * @param {callback} resolve - callback for resolve
 * @param {callback} reject - callback for reject
 */
function unshorten(url, resolve, reject) {
    // inspired by https://stackoverflow.com/a/62588602
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