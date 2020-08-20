import dynamicLoader from './dynamic-loader'

import qs from 'qs'
import marked from 'marked'
import { resolve } from './path-utils'
import FailedLinkPlugin from '../components/FailedLinkPlugin.vue'
import getConfig from './config'

export default class {
  constructor () {
    let dropdownTitle = ''
    const renderer = new marked.Renderer()

    renderer.paragraph = (text) => text

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

    renderer.list = (body, ordered, start) => {
      return `<BNavbarNav><BNavItemDropdown text="${dropdownTitle}" >${body}</BNavItemDropdown></BNavbarNav>`
    }

    renderer.listitem = (text) => {
      return text.replace(/^(<)BNavbarNav><BNavItem|(<\/)BNavItem><\/BNavbarNav(>)$/g, '$1$2BDropdownItem$3')
    }

    renderer.link = (href, title, text) => {
      if (href) {
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
          return `<BNavbarNav><BNavItem href="${href}">${text}</BNavItem></BNavbarNav>`
        }
      } else {
        dropdownTitle = text
        return ''
      }
    }

    this.options = {
      renderer,
      breaks: true
    }
  }

  async parse (md) {
    this.components = {}

    let appTitle = 'MDBlog'
    try {
      const config = await getConfig
      appTitle = config.title
    } catch (e) {}

    const uglyHtml = marked(md, this.options)

    return `<BNavbar id="mdblog-navigation" toggleable="md" type="light" variant="light"><BNavbarBrand href="#!/index.md">${appTitle}</BNavbarBrand><BNavbarToggle target="nav-collapse"></BNavbarToggle><BCollapse id="nav-collapse" is-nav>${uglyHtml}</BCollapse></BNavbar>`
  }

  getComponents () {
    return this.components
  }
}
