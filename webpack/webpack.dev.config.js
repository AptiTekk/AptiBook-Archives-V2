/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

const config = require('./webpack.common.config.js');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

config.module.rules.unshift(
    {
        test: /\.ts$/,
        use: ['awesome-typescript-loader', 'angular2-template-loader', 'angular-router-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
    }
);

config.plugins.push(
    new HtmlWebpackPlugin({
        template: path.join(__dirname, '../src/frontend/index.html.ejs'),
        favicon: path.join(__dirname, '../src/frontend/resources/favicons/favicon.ico'),
        filename: path.join(__dirname, '../target/classes/static/index.html'),
        inject: 'body',
        minify: {
            minifyCSS: true,
            minifyJS: true,
            removeComments: true,
            collapseWhitespace: true,
            collapseInlineTagWhitespace: true
        },
        chunksSortMode: 'dependency',
        dev: true
    }),
    new CleanWebpackPlugin(['resources'], {
        root: path.join(__dirname, '../target/classes/static')
    })
);

config.devtool = 'source-map';

module.exports = config;