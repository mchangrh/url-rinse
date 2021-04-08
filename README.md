# url-rinse
![Test Status](https://img.shields.io/github/workflow/status/mchangrh/url-rinse/unit-test?label=tests)
![Build Status](https://img.shields.io/github/workflow/status/mchangrh/url-rinse/npm-publish)
[![install Size](https://packagephobia.com/badge?p=url-rinse)](https://packagephobia.com/result?p=url-rinse)

Cleans up URLs

# Install
```
npm i url-rinse
```

# Usage
```
const rinse = require('url-rinse');
```

## General
 - `await unshorten(url)` - unshorten with node https
 - `await swUnshorten(url)` - unshorten with window.fetch (Service Workers)
 - `removeParam(url)` - removes all query parameters
 - `defer(url)` - remove referer with https://anonym.to

## Specific
 - `amazon(url)` - shorten amazon url
 - `reddit(url)` - shortens reddit url

