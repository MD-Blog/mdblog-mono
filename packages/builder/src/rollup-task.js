const chalk = require('chalk')
const _ = require('lodash')
const fs = require('fs-extra')
const rollup = require('rollup')
const babel = require('@rollup/plugin-babel').default
const filesize = require('filesize')
const nodeResolve = require('@rollup/plugin-node-resolve').default
const globals = require('rollup-plugin-node-globals')
const terser = require('rollup-plugin-terser').terser
const commonjs = require('@rollup/plugin-commonjs')
const vue = require('rollup-plugin-vue')
const postcss = require('rollup-plugin-postcss')

module.exports = (task, env) => {
  const banner = `/**
* ${env.package.name} v${env.package.version}
* Copyright © mdblog 2019.
*/
`

  const entry = `src/${task.entry || 'main.js'}`

  const defaultInputOptions = {
    input: env.resolve(entry),
    plugins: [
      commonjs({ browser: true }),
      vue(),
      postcss(),
      nodeResolve({ browser: true }),
      babel({
        babelrc: false,
        babelHelpers: 'runtime',
        presets: [
          ['@babel/env', { modules: false }]
        ],
        plugins: [
          // '@babel/external-helpers',
          '@babel/transform-runtime',
          '@babel/syntax-dynamic-import'
        ],
        extensions: ['.js', '.es', '.vue'],
        comments: true,
        exclude: 'node_modules/**'
      }),
      globals()
    ]
  }

  const inputOptions = _.extend(defaultInputOptions, _.pick(task.config, ['external']))
  inputOptions.external = id => {
    if (/^(he|qs|blueimp-md5|jsonic|marked|prismjs|prismjs\/.*|axios|bootstrap|jquery|vue|bootstrap-vue|@mdblog\/mdblog)$/.test(id)) {
      return true
    } else if (_.isFunction(task.config.external)) {
      return task.config.external(id)
    } else {
      return false
    }
  }

  const inputOptionsMinify = { ...inputOptions }
  inputOptionsMinify.plugins = [...inputOptionsMinify.plugins, terser()]

  const size = code => filesize(Buffer.byteLength(code))

  ;(async () => {
    console.log(`Version: rollup ${rollup.VERSION}`)
    let bundle = await rollup.rollup(inputOptions)
    let source = await bundle.generate({
      output: {
        chunkFileNames: '[name]',
        banner: banner,
        format: 'system',
        ..._.pick(task.config, ['globals'])
      }
    })

    for (const output of source.output) {
      const code = output.code

      let fileName = `dist/${output.fileName}`
      console.info(' ', chalk.green.bold(`${fileName}  `), size(code))
      fs.outputFileSync(env.resolve(fileName), code, 'utf8')
    }
    console.log(chalk.cyan('\n  build done!\n\n'))

    bundle = await rollup.rollup(inputOptionsMinify)
    source = await bundle.generate({
      output: {
        chunkFileNames: '[name]',
        banner: banner,
        format: 'system',
        ..._.pick(task.config, ['globals'])
      }
    })

    for (const output of source.output) {
      const code = output.code

      let fileName = `dist/${output.fileName}`.replace(/\.js$/i, '.min.js')
      console.info(' ', chalk.green.bold(`${fileName}  `), size(code))
      fs.outputFileSync(env.resolve(fileName), code, 'utf8')
    }
    console.log(chalk.cyan('\n  build minify done!\n\n'))
  })()
}
