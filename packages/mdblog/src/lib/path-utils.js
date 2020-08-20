function normalizeArray (parts, allowAboveRoot) {
  const res = []
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i]

    // ignore empty parts
    if (!p || p === '.') continue

    if (p === '..') {
      if (res.length && res[res.length - 1] !== '..') {
        res.pop()
      } else if (allowAboveRoot) {
        res.push('..')
      }
    } else {
      res.push(p)
    }
  }

  return res
}

function resolve () {
  let resolvedPath = ''
  let resolvedAbsolute = false

  for (let i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    const path = (i >= 0) ? arguments[i] : '/'

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings')
    } else if (!path) {
      continue
    }

    resolvedPath = path + '/' + resolvedPath
    resolvedAbsolute = path[0] === '/'
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(resolvedPath.split('/'), !resolvedAbsolute).join('/')

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.'
}

export {
  resolve
}
