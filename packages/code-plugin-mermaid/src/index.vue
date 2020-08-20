<template>
  <BTabs small card>
    <BTab title="Graph" active><pre class="mermaid" ref="graph"><slot /></pre></BTab>
    <BTab title="Source"><pre><slot /></pre></BTab>
  </BTabs>

</template>

<script>
  import './dynamic-dependencies'

  const mMermaid = import('mermaid')

  mMermaid.then(({default: mermaid}) => {
    mermaid.initialize({startOnLoad: false, theme: 'forest', multigraph: true})
  })

  export default {
    props: {
      metaTitle: {
        type: String,
        default: ''
      },
      metaOpts: {
        type: String,
        default: ''
      }
    },
    mounted () {
      mMermaid.then(({default: mermaid}) => {
        mermaid.init(undefined, this.$refs.graph[0])
      })
    }
  }
</script>

<style scoped>

</style>
