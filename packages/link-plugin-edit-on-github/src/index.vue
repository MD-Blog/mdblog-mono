<template>
  <div>
    <BNavbarNav>
      <BNavItem :href="editUrl" target="_blank">{{metaTitle}}</BNavItem>
    </BNavbarNav>
  </div>
</template>

<script>
  let regex = /^https:\/\/([\w-]*)\.github\.io\/.*/i
  export default {
    props: {
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
    },
    data () {
      return {
        editUrl: ''
      }
    },
    mounted () {
      const text = this.metaTitle || 'Edit'
      const [repo, file] = this.metaHref.split(':')
      const filePath = (file || `content/${location.hash.replace(/^#!\//, '')}`).replace(/^\//, '')
      const [userName, branch = 'master'] = (() => {
        const matches = regex.exec(window.location.href)
        if (matches) {
          return [matches[1]]
        } else {
          return repo.split('#')
        }
      })()
      this.editUrl = `https://github.com/${userName}/${userName}.github.io/edit/${branch}/${filePath}`
    }
  }
</script>

<style scoped>

</style>
