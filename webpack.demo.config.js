const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: {
    main: [
      path.resolve(__dirname, './demo/index.ts')
    ]
  },

  output: {
    path: path.resolve(__dirname, './docs'),
    filename: 'main.[hash].js',
    publicPath: './'
  },

  resolve: {
    extensions: ['.js', '.ts']
  },

  externals: {
    'fs': true,
    'path': true,
  },
  
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader'
        },
        exclude: /node_modules/
      },
      {
        test: /\.wgsl$/,
        use: {
          loader: './loader/webpack-wgsl-loader',
          options: {
            esModule: false
          }
        }
      },
      {
        test: /\.(png|jpg|webp|mp4)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 15000
          }
        }
      },
      {
        test: /\.gltf$/,
        use: {
          loader: 'seinjs-gltf-loader'
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './demo/index.html')
    })
  ],

  devServer: {
    contentBase: path.join(__dirname, './demo/assets'),
    port: 8888,
    contentBasePublicPath: '/assets',
    hot: true,
    host: '0.0.0.0'
  }
};
