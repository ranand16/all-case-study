const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const { NODE_ENV } = process.env;

const isDevelopment = NODE_ENV === 'development';

const plugins = [
  // Ignore all locale files of moment.js
  new HtmlWebpackPlugin({
    template: './public/index.html',
    alwaysWriteToDisk: true,
  }),
  // new CopyWebpackPlugin({
  //   patterns: ['./public/favicon.ico', './public/manifest.json'],
  // }),
  new MiniCssExtractPlugin({
    filename: isDevelopment ? '[name].css' : '[name].[contenthash:8].css',
    chunkFilename: isDevelopment
      ? '[name].bundle.css'
      : '[name].[contenthash:8].css',
  }),
];

if (!isDevelopment) {
  plugins.push(
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
  plugins.push(
    new CompressionPlugin({
      filename: '[path].br[query]',
      algorithm: 'brotliCompress',
      test: /\.(js|css|html|svg)$/,
      compressionOptions: {
        level: 11,
      },
      threshold: 10240,
      minRatio: 0.8,
    }),
  );
}

if (isDevelopment) {
  plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = {
  mode: NODE_ENV || isDevelopment,
  entry: ['./src/index'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: isDevelopment ? '[name].js' : '[name].[contenthash:8].js',
    chunkFilename: isDevelopment
      ? '[name].bundle.js'
      : '[name].[contenthash:8].js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  optimization: {
    moduleIds: 'hashed',
    runtimeChunk: {
      name: 'manifest',
    },
    splitChunks: {
      cacheGroups: {
        common: {
          test: /[\\/]node_modules[\\/](react|react-dom)[\\/]/,
          name: 'common',
          chunks: 'all',
        },
      },
    },
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          // ... other loaders
          {
            loader: require.resolve('babel-loader'),
            options: {
              plugins: [
                isDevelopment && require.resolve('react-refresh/babel'),
              ].filter(Boolean),
            },
          },
        ],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.svg$/,
        use: [
          '@svgr/webpack',
          {
            loader: 'url-loader',
          },
        ],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          {
            loader: 'url-loader',
          },
        ],
      },
    ],
  },
};