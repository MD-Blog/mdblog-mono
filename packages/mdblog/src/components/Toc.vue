<script>
  import md5 from 'blueimp-md5'
  import marked from 'marked'

  const renderer = new marked.Renderer()

  const fun = () => ''
  for (const m of Object.keys(marked.Renderer.prototype)) {
    if (m !== 'text') renderer[m] = fun
  }

  renderer.heading = (text, level) => {
    if (level > 1 && level < 3) {
      const hash = md5(text)
      return `<BNavItem href="#_${hash}" @click="contentScrollToId($event, '_${hash}')">${text}</BNavItem>`
    }
    return ''
  }

  const options = {
    renderer,
    breaks: true
  }

  export default {
    render (h) {
      const toc = Vue.compile(this.toc)
      toc.methods = this.$options.methods
      return h(toc)
    },
    props: {
      content: {
        type: String,
        default: ''
      },
    },
    data() {
      return {
        toc: ''
      }
    },
    mounted () {
      this.$root.$on('content-change', (md) => {
        const $el = document.body.querySelector(`[id=mdblog-content]`)
        let $ref = this.$el
        while ($ref && $ref.offsetTop === 0) {
          $ref = $ref.offsetParent
        }
        const top = $ref && $ref.offsetTop || 0

        this.toc = `<BNav id="mdblog-toc" vertical small v-b-scrollspy="${top}">${marked(md, options)}</BNav>`
      })
    },
    methods: {
      contentScrollToId (evt, id) {
        evt.preventDefault()
        this.$root.$emit('content-scroll-to-id', id)
      }
    }
  }
</script>

<style>

</style>
