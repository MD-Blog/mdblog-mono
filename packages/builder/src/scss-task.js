'use strict'

const chalk = require('chalk')
const fs = require('fs-extra')
const sass = require('node-sass')
const filesize = require('filesize')
const postcss = require('postcss')
const autoprefixer = require('autoprefixer')

const size = code => filesize(Buffer.byteLength(code))

module.exports = function (task, env) {
  const dist = env.dist
  task.entry = `src/${task.entry || 'scss/index.scss'}`
  task.entry = env.normalize(env.resolve(task.entry))

  console.log(sass.info + '\n')

  const postcssOptions = { from: void 0 }

  sass.render({ data: `@import "${task.entry}";` }, (err, ret) => {
    if (err) {
      console.log(chalk.red(err))
    } else {
      console.log(`Time: ${ret.stats.duration}ms`)
      postcss([autoprefixer]).process(ret.css, postcssOptions).then((ret) => {
        fs.outputFileSync(env.resolve(`${dist}/style/index.css`), ret.css)
        console.log(chalk.green.bold('  index.css\t'), size(ret.css))
        console.log(chalk.cyan('\n  Build sass complete.\n'))
      })
    }
  })
}
