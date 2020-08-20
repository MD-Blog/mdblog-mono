import { dynamicLoader } from '@mdblog/mdblog'

dynamicLoader.register({
  test: 'jstree',
  path: () => `./node_modules/jstree/dist/jstree.min.js`
})
