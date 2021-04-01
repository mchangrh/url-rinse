# url-rinse
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
 - `rinse.unshorten(url)` - unshorten with node https
 - `rinse.swUnshorten(url)` - unshorten with Service Worker fetch (CF Workers)
 - `rinse.removeQuery(url)` - removes all query strings
 - `rinse.derefer(url)` - derefers url with https://anonym.to

## Specific
 - `rinse.amazon(url)` - removes query strings and directs to /dp page
 - `rinse.reddit(url)` - removes query string and shortens reddit urls

