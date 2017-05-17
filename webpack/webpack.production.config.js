/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

const config = require('./webpack.common.config.js');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

config.module.rules.unshift(
    {
        test: /\.ts$/,
        use: '@ngtools/webpack',
        exclude: [/\.(spec|e2e)\.ts$/]
    }
);

config.plugins.push(
    new AotPlugin({
        tsConfigPath: path.join(__dirname, '../tsconfig.json'),
        entryModule: path.join(__dirname, '../src/frontend/scripts/app.module#AppModule')
    }),
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
        chunksSortMode: 'dependency'
    })
);

config.output = {
    path: path.join(__dirname, '../target/classes/static/'),
    filename: 'resources/scripts/[name]-[chunkhash].js',
    chunkFilename: 'resources/scripts/[id]-[chunkhash].chunk.js',
    publicPath: "https://cdn.aptibook.net/"
};

module.exports = config;