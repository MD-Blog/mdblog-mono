
<template>
  <div id="app">
    <Theme id="md-all"/>
  </div>
</template>

<script>
  import dynamicLoader from './lib/dynamic-loader'
  import getConfig from './lib/config'

  export default {
    components: {
      async Theme () {
        const config = await getConfig
        const themeName = config.theme || 'default'
        let component
        try {
          component = await dynamicLoader.load(`@mdblog/theme-${themeName}`)
        } catch (e) {
          console.log(`Load theme failed [${themeName}], use default.`)
          component = await dynamicLoader.load(`@mdblog/theme-default`)
        }
        return component
      }
    },
    async mounted () {
      const config = await getConfig
      document.title = config.title
    }
  }
</script>

<style>
  @import './node_modules/font-awesome/css/font-awesome.min.css';
  @import './node_modules/bootstrap/dist/css/bootstrap.css';
  @import './node_modules/bootstrap-vue/dist/bootstrap-vue.css';
  @import './node_modules/prismjs/themes/prism-dark.css';
  @import './node_modules/prismjs/plugins/toolbar/prism-toolbar.css';
  @import './node_modules/prismjs/plugins/line-numbers/prism-line-numbers.css';
  @import './node_modules/@mdblog/mdblog/dist/style/index.css';
</style>
