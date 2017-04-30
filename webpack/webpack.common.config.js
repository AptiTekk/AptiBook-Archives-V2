/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

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
                test: /\.(component|page)\.html$/,
                use: ["to-string-loader", "html-loader?-minimize"]
            },
            {
                test: /\.html$/,
                use: "html-loader?-minimize",
                exclude: [/\.(component|page)\.html$/]
            },
            {
                test: /\.(component|page)\.css$/,
                use: ["to-string-loader", "css-loader"]
            },
            {
                test: /\.css(\?v=[\d\.]+)?$/,
                use: ["style-loader", "css-loader"],
                exclude: [/\.(component|page)\.css$/]
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
                test: /\.(png|jpg|gif|svg)(\?v=[\d\.]+)?$/,
                use: "file-loader?name=./resources/images/[hash].[ext]"
            },
            {
                test: /\.(ttf|eot|woff|woff2)(\?v=[\d\.]+)?$/,
                use: 'file-loader?name=./resources/fonts/[hash].[ext]'
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
        }),
        new CleanWebpackPlugin(['resources'], {
            root: path.join(__dirname, '../target/classes/static')
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
