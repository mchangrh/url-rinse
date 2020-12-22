/**
 * removes all queries and parameters
 * @param {String} url - URL to clean 
 */
function removeQuery(url) {
    const noQuery = url.replace(/&.*/, '') // remove all queries
    const noParam = noQuery.split('?') // split by parameter
    return noParam[0] // return first result from parameter split
}