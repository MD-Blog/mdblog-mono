<template>
  <BTabs small card>
    <BTab title="Info" active>Link plugin load failed! [{{metaPluginName}}]</BTab>
    <BTab title="Code">{{metaTitle}} {{metaHref}} {{metaOpts}}</BTab>
  </BTabs>

</template>

<script>
  export default {
    props: {
      metaPluginName: {
        type: String,
        default: 'unknown'
      },
      metaTitle: {
        type: String,
        default: ''
      },
      metaHref: {
        type: String,
        default: ''
      },
      metaOpts: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped>

</style>
