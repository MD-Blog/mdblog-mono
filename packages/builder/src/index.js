const chalk = require('chalk')
const _ = require('lodash')
const path = require('path')

const projectDir = path.resolve('.')

const executors = {
  copy: require('./copy-task'),
  scss: require('./scss-task'),
  rollup: require('./rollup-task')
}

const env = {
  dist: 'dist',
  cwd: projectDir,
  package: _.cloneDeep(require(path.join(projectDir, 'package.json'))),
  resolve: dir => path.join(projectDir, dir),
  normalize: filePath => filePath.replace(/\\/g, '/')
}

const config = require(path.join(projectDir, 'build/build.config.js'))

for (const task of config.tasks) {
  const method = executors[task.type]
  if (method) {
    method(task, env)
  } else {
    console.log(chalk.red(`Executors not found! [${task.type}]`))
  }
}
