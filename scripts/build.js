const yargs = require('yargs')
const execa = require('execa')
const getPackageDir = require('./utils/getPackageDir')
const allPackages = require('./utils/allPackages')

const argv = yargs
  .option('all', {
    alias: 'a',
    type: 'boolean',
    description: 'build all project.'
  })
  .option('projects', {
    alias: 'p',
    type: 'array',
    description: 'project to build.'
  })
  .argv

if (argv.all) argv.projects = allPackages

if (argv.projects) {
  argv.projects.forEach((project) => {
    console.log(`build ${project} ...`)
    execa('yarn',
      [
        'run',
        'build'
      ],
      {
        cwd: getPackageDir(project),
        stdio: 'inherit'
      }
    ).addListener('close', () => {
      console.log(`build ${project} success.`)
    })
  })
}
