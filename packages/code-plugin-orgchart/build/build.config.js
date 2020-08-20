module.exports = {
  tasks: [
    {
      type: 'rollup',
      entry: 'index.vue',
      config: {
        external: (id) => /^(orgchart)$/.test(id),
        globals: {

        }
      }
    }
  ]
}
