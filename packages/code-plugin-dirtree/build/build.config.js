module.exports = {
  tasks: [
    {
      type: 'copy',
      files: ['icon']
    },
    {
      type: 'rollup',
      entry: 'index.vue',
      config: {
        external: (id) => /^(jstree)$/.test(id),
        globals: {

        }
      }
    },
    {
      type: 'scss',
      entry: 'scss/index.scss'
    }
  ]
}
