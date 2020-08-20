<template>
  <div class="mdblog-theme-demo">
    <Content />
  </div>
</template>

<script>
  export default {
    components: {
      async Content () {
        const { Content } = await import('@mdblog/mdblog')
        console.log(Content)
        return Content
      }
    }
  }
</script>

<style scoped>

</style>
