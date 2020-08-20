import { dynamicLoader } from '@mdblog/mdblog'

dynamicLoader.register({
  test: 'orgchart',
  path: () => `./node_modules/orgchart/dist/js/jquery.orgchart.min.js`
})
