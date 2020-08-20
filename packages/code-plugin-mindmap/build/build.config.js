module.exports = {
  tasks: [
    {
      type: 'rollup',
      entry: 'index.vue',
      config: {
        external: (id) => /^(@antv\/g6|@antv\/hierarchy)$/.test(id),
        globals: {

        }
      }
    }
  ]
}
