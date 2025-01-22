const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const cwd = process.cwd();

function createWebpackAliases (aliases) {
    const result = {};
    for (const name in aliases) {
        result[name] = path.join(cwd, aliases[name]);
    }
    return result;
}

const aliases = createWebpackAliases({
    '@assets': 'assets',
    '@src': 'src',
});

function inDev() {
    return process.env.NODE_ENV == 'development';
}

const webpackRules = [
    {
        // Typescript loader
        test: /\.tsx?$/,
        exclude: /(node_modules|\.webpack)/,
        use: {
        loader: 'ts-loader',
        options: {
            transpileOnly: true,
        },
        },
    },
    {
        // CSS Loader
        test: /\.css$/,
        use: [
        { loader: inDev() ? 'style-loader' : MiniCssExtractPlugin.loader },
        { loader: 'css-loader' },
        ],
    },
    {
        // SCSS (SASS) Loader
        test: /\.s[ac]ss$/i,
        use: [
        { loader: inDev() ? 'style-loader' : MiniCssExtractPlugin.loader },
        { loader: 'css-loader' },
        { loader: 'sass-loader' },
        ],
    },
    {
        // Less loader
        test: /\.less$/,
        use: [
        { loader: inDev() ? 'style-loader' : MiniCssExtractPlugin.loader },
        { loader: 'css-loader' },
        { loader: 'less-loader' },
        ],
    },
    {
        // Assets loader
        // More information here https://webpack.js.org/guides/asset-modules/
        test: /\.(gif|jpe?g|tiff|png|webp|bmp|svg|eot|ttf|woff|woff2)$/i,
        type: 'asset',
        generator: {
        filename: 'assets/[hash][ext][query]',
        },
    },
];

const wplugins = [
    new ForkTsCheckerWebpackPlugin(),
    inDev() && new webpack.HotModuleReplacementPlugin(),
    inDev() && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({
        template: 'public/index.html',
        inject: true,
    }),
    new MiniCssExtractPlugin({
        filename: '[name].[chunkhash].css',
        chunkFilename: '[name].[chunkhash].chunk.css',
    }),
].filter(Boolean);

module.exports = {
    mode: 'development',
    entry: ['./src/index.tsx'],
    module: {
        rules: webpackRules,
    },
    output: {
        filename: '[name].js',
        chunkFilename: '[name].chunk.js',
        publicPath: ''
    },
    plugins: wplugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: aliases,
    },
    stats: 'errors-warnings',
    devtool: 'cheap-module-source-map',
    devServer: {
        open: true,
        historyApiFallback: true,
    },
    optimization: {
        splitChunks: {
        chunks: 'all',
        },
    },
    performance: {
        hints: false,
    },
};

