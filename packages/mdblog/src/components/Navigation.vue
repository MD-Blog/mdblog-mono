<script>
  import load from '../lib/data-loader'
  import Markdown from '../lib/markdown-navigation'

  const markdown = new Markdown()

  export default {
    render (h) {
      const c = Vue.compile(this.content)
      c.components = markdown.getComponents()
      return h(c)
    },
    data() {
      return {
        content: ''
      }
    },
    async mounted () {
      const href = 'navigation.md'
      try {
        const res = await load(`./content/${href}`)
        this.content = await markdown.parse(res.data)
      } catch (e) {
        this.content = await markdown.parse(`# Load content failed [${href}]: ${e.message}`)
      }
    }
  }
</script>

<style scoped>

</style>
