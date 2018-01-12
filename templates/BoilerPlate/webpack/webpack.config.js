const webpack = require('webpack');
const ManifestPlugin = require('webpack-manifest-plugin');
const path = require('path');
const fs = require('fs');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const outputPath = path.join(__dirname, 'release');
const CDN_HOST = '//cdn.upchina.com/YunXuanGu/';

module.exports = {
  entry: {
    index: './public/js/index.js'
  },
  output: {
    filename: 'js/[name].[chunkhash].js',
    // chunkFilename: 'js/[name].[chunkhash].js',
    publicPath: process.env.NODE_ENV === 'production' ? CDN_HOST : `/release/`,
    path: outputPath
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{ loader: 'css-loader', options: { minimize: true } }]
        })
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        loader: 'url-loader',
        options: {
          limit: 10000,
          publicPath:
            process.env.NODE_ENV === 'production' ? CDN_HOST : `/release/`,
          outputPath: 'images/'
        }
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(['release']),
    // 定义客户端环境变量调试用
    new webpack.DefinePlugin({
      IN_APP: 'true',
      'process.env.NODE_ENV': `"${process.env.NODE_ENV}"`
    }),
    // 提取所有css引用到单个文件
    new ExtractTextPlugin({
      filename: 'css/[name].[contenthash].css',
      allChunks: true
    }),
    // 忽略momentjs的国际化相关资源文件
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    // 提取node_modules中的引用到单独的公共文件中，命名为vendor
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      minChunks: function(module, count) {
        let context = module.context;
        return context && context.indexOf('node_modules') >= 0;
      }
    }),
    // 提取webpack运行环境代码到单独的文件，命名为runtime(只要是没在entry中出现的name即可)
    new webpack.optimize.CommonsChunkPlugin({
      name: 'runtime',
      minChunks: Infinity
    }),
    // 生成文件名：真实文件名（含hash）对应的json文件，给服务端动态加载使用
    new ManifestPlugin(),
    // 压缩混淆代码
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
      compress: {
        warnings: false,
        drop_console: true
      }
    })
    // 运行分析服务，分析优化时使用
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'server',
    //   analyzerHost: '127.0.0.1',
    //   analyzerPort: 7788
    // })
  ]
};
