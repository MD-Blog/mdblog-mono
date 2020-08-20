import { dynamicLoader } from '@mdblog/mdblog'

dynamicLoader.register({
  test: 'mermaid',
  path: () => `./node_modules/mermaid/dist/mermaid.min.js`
})
