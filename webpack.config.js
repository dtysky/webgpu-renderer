const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'source-map',
  mode: 'development',
  entry: {
    main: [
      'webpack-dev-server/client?/',
      'webpack/hot/dev-server',
      path.resolve(__dirname, './demo/index.ts')
    ]
  },

  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'main.js',
    publicPath: '/'
  },

  resolve: {
    extensions: [".js"]
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
        test: /\.(vert|frag|comp)$/,
        use: {
          loader: './loader/webpack-glslang-loader'
        }
      },
      {
        test: /\.wgsl$/,
        use: {
          loader: 'raw-loader',
          options: {
            esModule: false
          }
        }
      },
      {
        test: /\.(png|jpg|mp4)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 15000
          }
        }
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './demo/index.html')
    }),
    new webpack.HotModuleReplacementPlugin()
  ],

  devServer: {
    contentBase: path.join(__dirname, './demo/assets'),
    port: 8888,
    contentBasePublicPath: '/assets',
    hot: true,
    host: '0.0.0.0'
  }
};
