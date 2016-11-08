var path = require('path');
var webpack = require('webpack');

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
                loaders: ['awesome-typescript-loader', 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },
            {
                test: /\.json$/,
                loader: 'json'
            },
            {
                test: /\.component\.html$/,
                loader: "to-string!html"
            },
            {
                test: /\.html$/,
                loader: "html",
                exclude: [/\.component\.html$/]
            },
            {
                test: /\.component\.css$/,
                loader: "to-string!css"
            },
            {
                test: /\.css$/,
                loader: "style!css",
                exclude: [/\.component\.css$/]
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: "file?name=./packed/images/[hash].[ext]"
            },
            {
                test: /\.(ttf|eot|woff|woff2)(\?v=\d+\.\d+\.\d+)?$/,
                loader: 'file?name=./packed/fonts/[hash].[ext]'
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['polyfills', 'vendor', 'main'].reverse(),
            minChunks: Infinity
        }),
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        })
    ],

    resolve: {
        extensions: ['', '.ts', '.js', '.json'],
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
