const assert = require('assert')
const rinse = require('../lib/urlrinse.js')

// redirect constants
const singleRedirect = 'https://git.io/url-rinse'
const doubleRedirect = 'https://bit.ly/2QLlxR1'
const redirectTarget = 'https://github.com/mchangrh/url-rinse'

describe('service worker unshorten', () => {
  it('direct link', async () => {
    const res = await rinse.swUnshorten(redirectTarget)
    assert.equal(res, redirectTarget)
  })
  it('single redirect', async () => {
    const res = await rinse.swUnshorten(singleRedirect)
    assert.equal(res, redirectTarget)
  })
  it('multiple redirects', async () => {
    const res = await rinse.swUnshorten(doubleRedirect)
    assert.equal(res, redirectTarget)
  })
})

describe('node.https unshorten', () => {
  it('direct link', async () => {
    const res = await rinse.unshorten(redirectTarget)
    assert.equal(res, redirectTarget)
  })
  it('single redirect', async () => {
    const res = await rinse.unshorten(singleRedirect)
    assert.equal(res, redirectTarget)
  })
  it('multiple redirects', async () => {
    const res = await rinse.unshorten(doubleRedirect)
    assert.equal(res, redirectTarget)
  })
})

const paramTest = {
  dirty: {
    single: 'https://example.com/?utm_source=mocha_test',
    multi: 'https://example.com/?utm_source=mocha_test&utm_medium=medium_test&utm_campaign=campaign_test',
    pathDirty: 'https://example.com/path/?utm_source=mocha_test&utm_medium=medium_test&utm_campaign=campaign_test',
    anchor: 'https://example.com/?utm_source=mocha_test&utm_medium=medium_test&utm_campaign=campaign_test#anchor',
    mix: 'https://example.com/path/?utm_source=mocha_test&utm_medium=medium_test&utm_campaign=campaign_test#anchor'
  },
  clean: {
    noPath: 'https://example.com/',
    path: 'https://example.com/path/'
  }
}

describe('remove parameters', () => {
  it('single parameter', () => {
    assert.equal(rinse.removeParam(paramTest.dirty.single), paramTest.clean.noPath)
  })
  it('multiple parameters', () => {
    assert.equal(rinse.removeParam(paramTest.dirty.multi), paramTest.clean.noPath)
  })
  it('parameter with path', () => {
    assert.equal(rinse.removeParam(paramTest.dirty.pathDirty), paramTest.clean.path)
  })
  it('parameters mixed with anchor', () => {
    assert.equal(rinse.removeParam(paramTest.dirty.anchor), paramTest.clean.noPath)
  })
  it('parameters mixed with path and anchor', () => {
    assert.equal(rinse.removeParam(paramTest.dirty.mix), paramTest.clean.path)
  })
})

const reddit = {
  dirty: {
    comment: 'https://www.reddit.com/r/help/comments/5524cd/how_to_shorten_a_reddit_comment_url/d86w2uv/',
    post: 'https://www.reddit.com/r/help/comments/5524cd/how_to_shorten_a_reddit_comment_url/'
  },
  clean: {
    comment: 'https://reddit.com/comments/5524cd/c/d86w2uv',
    post: 'https://reddit.com/comments/5524cd'
  }
}

describe('clean reddit post link', () => {
  it('clean post link', () => {
    const res = rinse.reddit(reddit.dirty.post)
    assert.equal(res, reddit.clean.post)
  })
  it('clean reddit comment link', () => {
    const res = rinse.reddit(reddit.dirty.comment)
    assert.equal(res, reddit.clean.comment)
  })
})

const amazon = {
  dirty: {
    dp: 'https://www.example.com/dp/B08YJBQK8W/ref=sr_1_?keywords=alexa+dot&qid=1550277314&s=digital-text&sr=1-1-spell',
    gp: 'https://www.example.com/gp/product/B08YJBQK8W/ref=sr_1_?keywords=alexa+dot&qid=1550277314&s=digital-text&sr=1-1-spell'
  },
  clean: 'https://www.example.com/dp/B08YJBQK8W'
}

describe('clean Amazon URL', () => {
  it('clean /dp link', () => {
    assert.equal(rinse.amazon(amazon.dirty.dp), amazon.clean)
  })
  it('clean /gp link', () => {
    assert.equal(rinse.amazon(amazon.dirty.gp), amazon.clean)
  })
})

const deferred = 'https://anonym.to/?https://github.com/mchangrh/url-rinse'

describe('dereferrer URL', () => {
  it('defer direct link', () => {
    assert.equal(rinse.defer(redirectTarget), deferred)
  })
})

const vergeAmp = {
  platform: "https://www.theverge.com/platform/amp/2019/4/16/18311894/logitech-express-alexa-remote-control-announced-features-pricing",
  google: "https://www.google.com/amp/s/www.theverge.com/platform/amp/2019/4/16/18311894/logitech-express-alexa-remote-control-announced-features-pricing",
  clean: "https://www.theverge.com/2019/4/16/18311894/logitech-express-alexa-remote-control-announced-features-pricing"
}

describe('theverge.com deamp', () => {
  it('clean /platform/amp', async () => {
    const res = await rinse.deAmp(vergeAmp.platform)
    assert.equal(res, vergeAmp.clean)
  })
  it('clean google AMP', async () => {
    const res = await rinse.deAmp(vergeAmp.google)
    assert.equal(res, vergeAmp.clean)
  })
  it('leave non-AMP link', async () => {
    const res = await rinse.deAmp(vergeAmp.clean)
    assert.equal(res, vergeAmp.clean)
  })
})

const huffPostAmp = {
  google: "https://www.google.com/amp/s/m.huffpost.com/us/entry/171234/amp",
  slash: "https://m.huffpost.com/us/entry/us_171234/amp",
  mobile: "https://m.huffpost.com/us/entry/us_171234",
  clean: "https://www.huffpost.com/entry/cia-realizes-its-been-usi_n_171234"
}

describe('huffpost.com deamp', () => {
  it('clean /amp', async () => {
    const res = await rinse.deAmp(huffPostAmp.slash)
    assert.equal(res, huffPostAmp.clean)
  })
  it('clean google AMP', async () => {
    const res = await rinse.deAmp(huffPostAmp.google)
    assert.equal(res, huffPostAmp.clean)
  })
  it('redirect mobile link', async () => {
    const res = await rinse.deAmp(huffPostAmp.mobile)
    assert.equal(res, huffPostAmp.clean)
  })
  it('leave non-AMP link', async () => {
    const res = await rinse.deAmp(huffPostAmp.clean)
    assert.equal(res, huffPostAmp.clean)
  })
})