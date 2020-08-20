module.exports = {
  tasks: [
    {
      type: 'rollup',
      entry: 'index.vue',
      config: {
        external: (id) => /^(mermaid)$/.test(id),
        globals: {

        }
      }
    }
  ]
}
