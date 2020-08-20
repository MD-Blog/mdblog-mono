import { dynamicLoader } from '@mdblog/mdblog'

dynamicLoader.register({
  test: /^@antv\/g6$/,
  path: () => `./node_modules/@antv/g6/build/g6.js`
})

dynamicLoader.register({
  test: /^@antv\/hierarchy$/,
  path: () => `./node_modules/@antv/hierarchy/build/hierarchy.js`
})
