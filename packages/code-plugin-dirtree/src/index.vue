<template>
  <BTabs small card>
    <BTab title="Graph" active><div class="code-plugin-dirtree" ref="graph"><slot /></div></BTab>
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
      const mJstree = import('jstree')
      mJstree.then(() => {
        var THEME_NAME = 'default'
        var $el = $(this.$refs.graph)
        try {
          var code = jsonic(he.decode($el.html()))
          $el.html('')
          $el.jstree({
            types: {
              babel: {icon: 'icon-file-type-babel'},
              config: {icon: 'icon-file-type-config'},
              default: {icon: 'icon-file-type-file'},
              folder: {icon: 'icon-file-type-folder'},
              js: {icon: 'icon-file-type-js'},
              json: {icon: 'icon-file-type-json'},
              md: {icon: 'icon-file-type-md'},
              npm: {icon: 'icon-file-type-npm'},
              rollup: {icon: 'icon-file-type-rollup'},
              scss: {icon: 'icon-file-type-scss'},
              vue: {icon: 'icon-file-type-vue'},
              webpack: {icon: 'icon-file-type-webpack'}
            },
            plugins: [ 'types' ],
            core: {
              themes: {name: THEME_NAME, dot: true},
              data: code
            }
          }).on('loaded.jstree', function (evt, jsTree) {
            jsTree.instance.open_all()
            $el.show()
          })
        } catch (e) {
          $el.html(e)
          $el.show()
        }
      })
    }
  }
</script>

<style scoped>
  @import './node_modules/jstree/dist/themes/default/style.css';
</style>

<style>
  @import './node_modules/@mdblog/code-plugin-dirtree/dist/style/index.css';
</style>
