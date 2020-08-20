import load from './data-loader'

export default (async () => {
  const config = {}
  try {
    const res = await load('config.json')
    if (typeof res.data === 'string') {
      res.data = JSON.parse(res.data)
    }
    Object.assign(config, res.data)
    console.log('Found a valid config.json file, using configuration', config)
  } catch (err) {
    console.error('unable to retrieve config.json: ' + err)
  }
  return config
})()
