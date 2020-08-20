<template>
  <BTabs small card>
    <BTab title="Info" active>Code plugin load failed! [{{metaPluginName}}]</BTab>
    <BTab title="Code"><pre><slot /></pre></BTab>
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
      metaOpts: {
        type: String,
        default: ''
      }
    }
  }
</script>

<style scoped>

</style>
