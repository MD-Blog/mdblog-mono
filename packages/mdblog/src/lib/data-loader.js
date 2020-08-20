/* global location */

import axios from 'axios'
import md5 from 'blueimp-md5'
import jsonp from './jsonp'

export default (url) => {
  if (location.protocol === 'file:') {
    const hash = md5(url.replace(/^\.\//, ''))
    return new Promise((resolve, reject) => {
      jsonp(`mock/${hash}.js`, { name: 'jsonpcallback_' + hash }, (err, data) => {
        if (!err) {
          resolve({ data })
        } else {
          reject(err)
        }
      })
    })
  } else {
    return axios.get(url)
  }
}
