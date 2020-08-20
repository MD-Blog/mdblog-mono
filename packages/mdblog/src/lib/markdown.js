import dynamicLoader from './dynamic-loader'

import Vue from 'vue'
import he from 'he'
import qs from 'qs'
import md5 from 'blueimp-md5'
import marked from 'marked'
import Prism from 'prismjs'
import 'prismjs/plugins/line-numbers/prism-line-numbers.min'
import 'prismjs/plugins/autoloader/prism-autoloader.min'
import 'prismjs/plugins/toolbar/prism-toolbar.min'
import 'prismjs/plugins/show-language/prism-show-language.min'
import { resolve } from './path-utils'
import FailedLinkPlugin from '../components/FailedLinkPlugin.vue'
import FailedCodePlugin from '../components/FailedCodePlugin.vue'

export default class extends Vue {
  constructor () {
    super()
    Prism.plugins.autoloader.languages_path = 'node_modules/prismjs/components/'

    const renderer = new marked.Renderer()

    renderer.heading = (text, level) => {
      return `<h${level} id="_${md5(text)}">${text}</h${level}>`
    }

    renderer.table = (header, body) => {
      if (body) body = '<tbody>' + body + '</tbody>'
      return `<table class="table-bordered">\n<thead>\n${header}</thead>\n${body}</table>\n`
    }

    renderer.image = (href, title, text) => {
      if (href === null) {
        return text
      }
      const end = window.location.hash.lastIndexOf('/')
      let base
      if (window.location.hash.startsWith('#!')) {
        base = window.location.hash.substring(2, end)
      } else {
        base = window.location.hash.substring(1, end)
      }
      const { width, height } = qs.parse(href.split('?')[1])
      if (!href.startsWith('/') && !/(http|https):\/\//.test(href)) {
        href = resolve(base, href)
      }
      return `<div style="text-align:center"><img${title ? ` title="${title}"` : ''}${width ? ` width="${width}"` : ''}${height ? ` height="${height}"` : ''} src="${encodeURI(`content${href}`)}" alt="${text}"/></div>`
    }

    const _link = renderer.link
    renderer.link = (href, title, text) => {
      let base
      const end = window.location.hash.lastIndexOf('/')
      if (window.location.hash.startsWith('#!')) {
        base = window.location.hash.substring(2, end)
      } else {
        base = window.location.hash.substring(1, end)
      }
      if (/^plugin!.+/.test(text)) {
        // link 插件
        const [url, title] = text.substr(7).split(':')
        let [plugin, query] = url.split('?')
        plugin = `link-plugin-${plugin}`
        this.components[plugin] = async () => {
          let component
          try {
            component = await dynamicLoader.load(`@mdblog/${plugin}`)
          } catch (e) {
            component = FailedLinkPlugin
          }
          return component
        }
        return `<${plugin} meta-plugin-name="${plugin}" meta-base-path="${base}"${title ? ` meta-title="${title}"` : ''}${href ? ` meta-href="${href}"` : ''}${query ? ` meta-opts="${query}"` : ''} />`
      } else {
        if (!href.startsWith('/') && !/(http|https):\/\//.test(href)) {
          href = resolve(base, href)
        }
        if (href.startsWith('/')) href = `#!${href}`
        return _link.call(renderer, href, title, text)
      }
    }

    const _code = renderer.code
    renderer.code = (code, lang) => {
      const matches = lang.match(/^(?:\s*([a-zA-Z0-9-_]+)\s+|)(plugin!.+)$/)
      if (matches) {
        // link 插件
        const [url, title] = matches[2].substr(7).split(':')
        let [plugin, query] = url.split('?')
        plugin = `code-plugin-${plugin}`
        this.components[plugin] = async () => {
          let component
          try {
            component = await dynamicLoader.load(`@mdblog/${plugin}`)
          } catch (e) {
            console.error('e')
            component = FailedCodePlugin
          }
          return component
        }
        return `<${plugin} meta-plugin-name="${plugin}"${title ? ` meta-title="${title}"` : ''}${query ? ` meta-opts="${query}"` : ''}>${he.encode(code)}</${plugin}>`
      } else {
        return _code.call(renderer, code, lang)
      }
    }

    this.options = {
      renderer,
      gfm: true,
      tables: true,
      breaks: true,
      langPrefix: 'line-numbers lang-',
      highlight (code, lang) {
        let type = Prism.languages[lang]
        if (!type) {
          type = Prism.languages.clike
        }
        return Prism.highlight(code, type)
      }
    }

    this.$on('mounted', async () => {
      Prism.highlightAll()
    })
  }
  async parse (md) {
    this.components = {}
    const uglyHtml = marked(md, this.options)
    return `<div id="mdblog-content" style="position:relative; overflow-y:auto">${uglyHtml}</div>`
  }
  getComponents () {
    return this.components
  }
}
