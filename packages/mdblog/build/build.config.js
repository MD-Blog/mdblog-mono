module.exports = {
  tasks: [
    {
      type: 'copy',
      files: ['index.js']
    },
    {
      type: 'rollup',
      entry: 'main.js',
      config: {}
    },
    {
      type: 'scss',
      entry: 'scss/index.scss'
    }
  ]
}
