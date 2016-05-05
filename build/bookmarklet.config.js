import webpack from 'webpack'
import config from '../config'
import _debug from 'debug'

const debug = _debug('app:bookmarklet:config')
const paths = config.utils_paths
const {__DEV__, __PROD__} = config.globals

debug('Create bookmarklet configuration.')
const webpackConfig = {
  name: 'client',
  target: 'web',
  devtool: config.compiler_devtool,
  resolve: {
    root: paths.base(config.dir_client),
    extensions: ['', '.js', '.jsx']
  },
  module: {}
}
// ------------------------------------
// Entry Points
// ------------------------------------
const APP_BOOKMARKLET_PATH = paths.base(config.dir_client) + '/bookmarklet.js'

webpackConfig.entry = {
  bookmarklet: [APP_BOOKMARKLET_PATH]
}

// ------------------------------------
// Bundle Output
// ------------------------------------
webpackConfig.output = {
  filename: `[name].js`,
  path: paths.base(config.dir_dist),
  publicPath: config.compiler_public_path
}

// ------------------------------------
// Plugins
// ------------------------------------
webpackConfig.plugins = []

if (__PROD__) {
  debug('Apply UglifyJS plugin.')
  webpackConfig.plugins.push(
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true
      }
    })
  )
}

// ------------------------------------
// Pre-Loaders
// ------------------------------------
webpackConfig.module.preLoaders = [{
  test: /\.(js|jsx)$/,
  loader: 'eslint',
  exclude: /node_modules/
}]

webpackConfig.eslint = {
  configFile: paths.base('.eslintrc'),
  emitWarning: __DEV__
}

// ------------------------------------
// Loaders
// ------------------------------------
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test: /\.(js|jsx)$/,
  exclude: /node_modules/,
  loader: 'babel',
  query: {
    cacheDirectory: '/tmp',
    plugins: ['transform-runtime'],
    presets: __DEV__
      ? ['es2015', 'react', 'stage-0', 'react-hmre']
      : ['es2015', 'react', 'stage-0']
  }
},
{
  test: /\.json$/,
  loader: 'json'
}]

export default webpackConfig
