module.exports = {
  tasks: [
    {
      type: 'rollup',
      entry: 'index.vue',
      config: {
        external: (id) => /^(mathjax)$/.test(id),
        globals: {

        }
      }
    }
  ]
}
