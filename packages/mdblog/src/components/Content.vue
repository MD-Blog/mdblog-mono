

<script>
  import load from '../lib/data-loader'
  import Markdown from '../lib/markdown'
  import { offsetTop, scrollTo } from '../lib/utils'

  const markdown = new Markdown ()

  export default {
    created () {
      window.onhashchange = () => {
        this.loadContent()
      }
      this.$root.$on('content-scroll-to-id', (id) => {
        const $el = document.body.querySelector(`[id='${id}']`)
        if ($el) {
          // Get the document scrolling element
          const scroller = document.scrollingElement || document.documentElement || document.body
          // Scroll heading into view (minus offset to account for nav top height
          let $ref = this.$el
          while ($ref && $ref.offsetTop === 0) {
            $ref = $ref.offsetParent
          }
          const top = $ref && $ref.offsetTop || 0
          scrollTo(scroller, offsetTop($el) - top, 100, () => {
            // Set a tab index so we can focus header for a11y support
            $el.tabIndex = -1
            // Focus the heading
            $el.focus()
          })
        }
      })
    },
    data() {
      return {
        content: ''
      }
    },
    mounted () {
      this.loadContent()
    },
    methods: {
      async loadContent () {
        let href
        if (window.location.hash.startsWith('#!')) {
          href = window.location.hash.substring(2)
        } else {
          href = window.location.hash.substring(1)
        }
        href = decodeURIComponent(href)
        href = href.replace(/^\//, '')
        if (href) {
          try {
            const { data: md } = await load(`./content/${href}`)

            this.$root.$emit('content-change', md)

            this.content = await markdown.parse(md)

            this.$nextTick(() => {
              markdown.$emit('mounted')
            })
          } catch (e) {
            this.content = await markdown.parse(`# Load content failed [${href}]: ${e.message}`)
          }
        }
      }
    },
    render (h) {
      if (!this.content) return ''
      const content = Vue.compile(this.content)
      content.components = markdown.getComponents()
      return h(content)
    }
  }
</script>

<style scoped>

</style>
