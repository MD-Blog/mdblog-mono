const resolveMap = [
  {
    test: /^@mdblog\/.*/,
    path: id => `node_modules/${id}/dist/index.js`
  }
]

const _resolve = System.resolve
System.resolve = (id, parentURL) => {
  if (!System.commonLibs[id]) {
    for (const item of resolveMap) {
      if (id.match(item.test)) {
        return item.path(id)
      }
    }
  }
  return _resolve.call(System, id, parentURL)
}

export default {
  load: id => import(id),
  register (m) {
    resolveMap.push(m)
  }
}
