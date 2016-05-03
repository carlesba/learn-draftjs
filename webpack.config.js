var config = process.env.NODE_ENV === 'production'
  ? require('./webpack.prod.config')
  : require('./webpack.dev.config')

module.exports = config
