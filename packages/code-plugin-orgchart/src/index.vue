<template>
  <BTabs small card>
    <BTab title="Graph" active><div ref="graph"><slot /></div></BTab>
    <BTab title="Source"><pre><slot /></pre></BTab>
  </BTabs>

</template>

<script>
  import './dynamic-dependencies'
  import $ from 'jquery'
  import he from 'he'
  import jsonic from 'jsonic'

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
      const mOrgchart = import('orgchart')
      mOrgchart.then(() => {
        var $el = $(this.$refs.graph)
        try {
          var code = jsonic(he.decode($el.html()), false)
          $el.html('')
          $el.orgchart({
            data: code,
            depth: 2,
            nodeContent: 'desc'
          })
          $el.show()
        } catch (e) {
          $el.html(e)
          $el.show()
        }
      })
    }
  }
</script>

<style scoped>
  @import '../node_modules/orgchart/dist/css/jquery.orgchart.min.css';
</style>
