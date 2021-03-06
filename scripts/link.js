const yargs = require('yargs')
const execa = require('execa')
const getPackageDir = require('./utils/getPackageDir')
const allPackages = require('./utils/allPackages')

const argv = yargs
  .option('all', {
    alias: 'a',
    type: 'boolean',
    description: 'link/unlink all project.'
  })
  .option('unlink', {
    alias: 'u',
    type: 'boolean',
    description: 'unlink project.'
  })
  .option('projects', {
    alias: 'p',
    type: 'array',
    description: 'project to link/unlink.'
  })
  .argv

if (argv.all) argv.projects = allPackages

if (argv.projects) {
  argv.projects.forEach((project) => {
    execa('yarn',
      [
        ...(argv.unlink ? ['unlink'] : ['link'])
      ],
      {
        cwd: getPackageDir(project),
        stdio: 'inherit'
      }
    )
  })
}
