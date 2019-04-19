const path = require('path'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  UglifyJSPlugin = require('uglifyjs-webpack-plugin'),
  OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin'),
  BrowserSyncPlugin = require('browser-sync-webpack-plugin'),
  StyleLintPlugin = require('stylelint-webpack-plugin'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  PurgecssPlugin = require('purgecss-webpack-plugin'), //todo configure purgecss
  ImageminPlugin = require('imagemin-webpack-plugin').default,
  glob = require('glob'),
  SpriteLoaderPlugin = require('svg-sprite-loader/plugin');

module.exports = {
  context: __dirname,
  entry: {
    frontend: ['babel-polyfill', './src/index.js'],
    customizer: './src/js/customizer.js'
  },
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name]-bundle.js'
  },
  mode: 'development',
  devtool: 'source-map',
  module: {
    rules: [
      {
        enforce: 'pre',
        exclude: /node_modules/,
        test: /\.jsx$/,
        loader: 'eslint-loader'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.s?css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          extract: true,
          spriteFilename: 'svg-defs.svg'
        }
      },
      {
        test: /\.(jpe?g|png|gif)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'images/',
              name: '[name].[ext]'
            }
          },
          'img-loader'
        ]
      }
    ]
  },
  plugins: [
    new StyleLintPlugin(),
    new MiniCssExtractPlugin({ filename: '../style.css' }),
    new SpriteLoaderPlugin(),
    new BrowserSyncPlugin({
      files: '**/*.php',
      injectChanges: true,
      proxy: 'http://underscores.test'
    }),
    new ImageminPlugin({
      disable: process.env.NODE_ENV !== 'production', // Disable during development
      pngquant: {
        quality: '95-100'
      }
    })
  ],
  optimization: {
    minimizer: [new UglifyJSPlugin(), new OptimizeCssAssetsPlugin()]
  }
};