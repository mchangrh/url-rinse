# url-rinse
![tests](https://img.shields.io/github/workflow/status/mchangrh/url-rinse/unit-test?label=tests)
![build](https://img.shields.io/github/workflow/status/mchangrh/url-rinse/npm-publish)
[![size](https://packagephobia.com/badge?p=url-rinse)](https://packagephobia.com/result?p=url-rinse)

Cleans up URLs
```
// install
npm i url-rinse
// use
const rinse = require('url-rinse')
```

## Functions
 - `await unshorten(url)` - unshorten with node https
 - `await swUnshorten(url)` - unshorten with window.fetch (Service Workers)
 - `removeParam(url)` - removes all query parameters
 - `defer(url)` - remove referer with https://anonym.to
 - `deAmp(url)` - return original non-AMP link (fetch/sw only)
 - `amazon(url)` - shorten amazon url
 - `reddit(url)` - shortens reddit url