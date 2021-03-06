/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

const path = require('path');
const webpack = require('webpack');

//noinspection JSUnresolvedVariable
const buildDir = process.env.bamboo_buildNumber !== undefined ? process.env.bamboo_buildNumber : 'dev';

const config = {
    cache: true,

    entry: {
        polyfills: path.join(__dirname, '../src/frontend/scripts/polyfills.ts'),
        vendor: path.join(__dirname, '../src/frontend/scripts/vendors/vendors.ts'),
        main: path.join(__dirname, '../src/frontend/scripts/main.ts')
    },

    module: {
        rules: [
            {
                test: /datatables\.net.*/,
                use: 'imports-loader?define=>false'
            },
            {
                test: /\.(component|directive)\.html$/,
                use: ["to-string-loader", "html-loader?-minimize"]
            },
            {
                test: /\.html$/,
                use: "html-loader?-minimize",
                exclude: [/\.(component|directive)\.html$/]
            },
            {
                test: /\.(component|directive)\.css$/,
                use: ["to-string-loader", "css-loader"]
            },
            {
                test: /\.(component|directive)\.scss$/,
                use: ["to-string-loader", "css-loader", "sass-loader"]
            },
            {
                test: /\.css(\?v=[\d\.]+)?$/,
                use: ["style-loader", "css-loader"],
                exclude: [/\.(component|directive)\.css$/]
            },
            {
                test: /\.scss(\?v=[\d\.]+)?$/,
                use: ["style-loader", "css-loader", "sass-loader"],
                exclude: [/\.(component|directive)\.scss$/]
            },
            {
                test: /\.xml$/,
                use: "xml-loader"
            },
            {
                test: /\.yaml/,
                use: ["json-loader", "yaml-loader"]
            },
            {
                test: /manifest\.json/,
                use: "file-loader?name=./resources/" + buildDir + "/json/[hash].[ext]"
            },
            {
                test: /\.(png|jpg|gif|svg)(\?v=[\d.]+)?$/,
                use: "file-loader?name=./resources/" + buildDir + "/images/[hash].[ext]"
            },
            {
                test: /\.(ttf|eot|woff|woff2)(\?v=[\d.]+)?$/,
                use: 'file-loader?name=./resources/' + buildDir + '/fonts/[hash].[ext]'
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
            jquery: 'jquery',
            "window.jQuery": 'jquery',
            tether: 'tether',
            Tether: 'tether',
            "window.tether": 'tether',
            "window.Tether": 'tether'
        })
    ],

    resolve: {
        extensions: ['.ts', '.js', '.json', '.jsx'],
        modules: ['node_modules'],
        alias: {
            // Force all modules to use the same jquery version.
            'jquery': path.join(__dirname, '../node_modules/jquery/src/jquery')
        }
    },

    output: {
        path: path.join(__dirname, '../target/classes/static/'),
        filename: './resources/' + buildDir + '/scripts/[name]-[chunkhash].js',
        sourceMapFilename: './resources/' + buildDir + '/scripts/[name]-[chunkhash].map',
        chunkFilename: './resources/' + buildDir + '/scripts/[id]-[chunkhash].chunk.js'
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
