<template>
  <BTabs small card>
    <BTab title="Graph" active><div class="mathjax math" ref="graph"><slot /></div></BTab>
    <BTab title="Source"><pre><slot /></pre></BTab>
  </BTabs>

</template>

<script>
  import './dynamic-dependencies'

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
      import('mathjax').then(({default: MathJax}) => {
        MathJax.Hub.Config({
          extensions: ['jsMath2jax.js'],
          jax: ['input/TeX', 'output/HTML-CSS']
        })
      })
    }
  }
</script>

<style scoped>

</style>
