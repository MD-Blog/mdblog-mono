import { dynamicLoader } from '@mdblog/mdblog'

dynamicLoader.register({
  test: 'mathjax',
  path: () => `./node_modules/mathjax/MathJax.js`
})
