function easeInOutQuad (t, b, c, d) {
  t /= d / 2
  if (t < 1) return c / 2 * t * t + b
  t--
  return -c / 2 * (t * (t - 2) - 1) + b
}

export function scrollTo (scroller, to, duration, cb) {
  const start = scroller.scrollTop
  const change = to - start
  const increment = 20
  let currentTime = 0

  const animateScroll = function animateScroll () {
    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    scroller.scrollTop = Math.round(val)

    if (currentTime < duration) {
      setTimeout(animateScroll, increment)
    } else if (cb && typeof cb === 'function') {
      cb()
    }
  }

  animateScroll()
}

export function offsetTop (el) {
  if (!el.getClientRects().length) {
    return 0
  }

  const bcr = el.getBoundingClientRect()
  const win = el.ownerDocument.defaultView
  return bcr.top + win.pageYOffset
}

export function appendDefaultFilenameToHash () {
  let newHashString = ''
  const currentHashString = window.location.hash || ''
  if (currentHashString === '' ||
    currentHashString === '#' ||
    currentHashString === '#!'
  ) {
    newHashString = '#!/index.md'
  } else if (currentHashString.startsWith('#!') &&
    currentHashString.endsWith('/')
  ) {
    newHashString = currentHashString + 'index.md'
  }
  if (newHashString) {
    window.location.hash = newHashString
  }
}
