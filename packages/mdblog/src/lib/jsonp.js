function noop () {}

/**
 * JSONP handler
 *
 * Options:
 *  - param {String} qs parameter (`callback`)
 *  - name {String} qs parameter
 *  - timeout {Number} how long after a timeout error is emitted (`60000`)
 *
 * @param {String} url
 * @param {Object|Function} optional options / callback
 * @param {Function} optional callback
 */

export default (url, opts, fn) => {
  if (typeof opts === 'function') {
    fn = opts
    opts = {}
  }
  if (!opts) opts = {}

  // use the callback name that was passed if one was provided.
  // otherwise generate a unique name by incrementing our counter.
  var id = opts.name

  var param = opts.param || 'callback'
  var timeout = opts.timeout !== null ? opts.timeout : 60000
  var enc = encodeURIComponent
  var target = document.getElementsByTagName('script')[0] || document.head
  var script
  var timer

  if (timeout) {
    timer = setTimeout(() => {
      cleanup()
      if (fn) fn(new Error('Timeout'))
    }, timeout)
  }

  function cleanup () {
    if (script.parentNode) script.parentNode.removeChild(script)
    window[id] = noop
    if (timer) clearTimeout(timer)
  }

  function cancel () {
    if (window[id]) {
      cleanup()
    }
  }

  window[id] = (data) => {
    cleanup()
    if (fn) fn(null, data)
  }

  // add qs component
  url += (~url.indexOf('?') ? '&' : '?') + param + '=' + enc(id)
  url = url.replace('?&', '?')

  // create script
  script = document.createElement('script')
  script.src = url
  target.parentNode.insertBefore(script, target)

  return cancel
}
