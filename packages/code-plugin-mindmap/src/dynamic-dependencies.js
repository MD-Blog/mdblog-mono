import { dynamicLoader } from '@mdblog/mdblog'

dynamicLoader.register({
  test: /^@antv\/g6$/,
  path: () => `./node_modules/@antv/g6/dist/g6.min.js`
})

dynamicLoader.register({
  test: /^@antv\/hierarchy$/,
  path: () => `./node_modules/@antv/hierarchy/dist/hierarchy.min.js`
})
