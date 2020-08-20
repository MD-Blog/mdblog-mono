const chalk = require('chalk')
const _ = require('lodash')
const fs = require('fs-extra')

module.exports = (task, env) => {
  console.log('Copy files:')
  if (!_.isArray(task.files)) {
    task.files = [task.files]
  }
  _.each(task.files, item => {
    const target = `${env.dist}/${item}`
    item = `src/${item}`
    fs.copySync(env.resolve(item), env.resolve(target))
    console.log(chalk.green.bold(`  copy -> ${item} to ${target}`))
  })
  console.log(chalk.cyan('\n  Copy files complete.\n'))
}
