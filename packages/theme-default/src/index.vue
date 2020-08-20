<template>
  <BContainer fluid class="mdblog-theme-default">
    <BRow class="mdblog-header">
      <BCol style="padding: 0">
        <Navigation />
      </BCol>
    </BRow>
    <BRow>
      <BCol cols="2" class="d-none d-md-block mdblog-toc">
        <Toc />
      </BCol>
      <BCol cols="12" md="10" class="mdblog-content">
        <Content />
      </BCol>
    </BRow>
  </BContainer>
</template>

<script>
  export default {
    components: {
      async Navigation () {
        const { Navigation } = await import('@mdblog/mdblog')
        return Navigation
      },
      async Content () {
        const { Content } = await import('@mdblog/mdblog')
        return Content
      },
      async Toc () {
        const { Toc } = await import('@mdblog/mdblog')
        return Toc
      }
    }
  }
</script>

<style>
  .mdblog-theme-default .mdblog-header {
    position: -webkit-sticky;
    position: sticky;
    top: 0;
    min-height: 4rem;
    z-index: 2000;
  }

  .mdblog-theme-default .mdblog-content {

  }

  .mdblog-theme-default .mdblog-toc {
    position: -webkit-sticky;
    position: sticky;
    top: 4rem;
    height: calc(100vh - 4rem)
  }

  .mdblog-theme-default .mdblog-toc .nav-link {
    padding: 2px 10px
  }

  .mdblog-theme-default .mdblog-toc .nav-link.active {
    color: red
  }
</style>
