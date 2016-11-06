var path = require('path');
var webpack = require('webpack');

var HtmlWebpackPlugin = require('html-webpack-plugin');

var config = {
    cache: true,
    devtool: 'source-map',

    entry: {
        polyfills: './src/frontend/scripts/polyfills',
        vendor: './src/frontend/scripts/vendor',
        main: './src/frontend/scripts/main'
    },

    output: {
        path: path.join(__dirname, 'src/main/webapp/'),
        filename: './packed/scripts/[name].bundle.js',
        sourceMapFilename: './packed/scripts/[name].map',
        chunkFilename: './packed/scripts/[id].chunk.js'
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.html/,
                loader: 'raw-loader'
            },
            {
                test: /\.css$/,
                loader: "style-loader!css-loader"
            },
            {
                test: /\.png$/,
                loader: "url-loader?limit=100000&name=./packed/images/[hash].[ext]"
            },
            {
                test: /\.jpg$/,
                loader: "file-loader?name=./packed/images/[hash].[ext]"
            },
            {
                test: /\.(woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file?name=./packed/fonts/[hash].[ext]'
            },
            {
                test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file?name=./packed/fonts/[hash].[ext]'
            },
            {
                test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file?name=./packed/fonts/[hash].[ext]'
            },
            {
                test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file?name=./packed/images/[hash].[ext]'
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'vendor', 'main'].reverse(),
            minChunks: Infinity
        }),
        new HtmlWebpackPlugin({
            template: './src/frontend/index.template.ejs',
            inject: 'body'
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })
    ],

    resolve: {
        extensions: ['', '.ts', '.js', '.json', '.css', '.scss', '.html'],
        modulesDirectories: ['node_modules']
    },

    node: {
        global: true,
        process: true,
        Buffer: false,
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false,
        clearTimeout: true,
        setTimeout: true
    }
};
module.exports = config;
