import dynamicLoader from './lib/dynamic-loader'

import Vue from 'vue'
import BootstrapVue from 'bootstrap-vue'
import Navigation from './components/Navigation.vue'
import Content from './components/Content.vue'
import Toc from './components/Toc.vue'
import App from './App.vue'
import { appendDefaultFilenameToHash } from './lib/utils'

appendDefaultFilenameToHash()

Vue.use(BootstrapVue)

const vue = new Vue({
  $bus: new Vue(),
  render: (h) => h(App)
})

vue.$mount('#app')

export {
  Navigation,
  Content,
  Toc,
  dynamicLoader
}
