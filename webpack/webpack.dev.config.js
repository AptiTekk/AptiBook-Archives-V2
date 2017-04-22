/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

const config = require('./webpack.common.config.js');
const AotPlugin = require('@ngtools/webpack').AotPlugin;
const path = require('path');

config.module.rules.unshift(
    {
        test: /\.ts$/,
        use: ['awesome-typescript-loader', 'angular2-template-loader', 'angular-router-loader'],
        exclude: [/\.(spec|e2e)\.ts$/]
    }
);

config.devtool = 'source-map';
config.output = {
    path: path.join(__dirname, '../src/main/resources/static/'),
    filename: './resources/scripts/[name]-[chunkhash].js',
    sourceMapFilename: './resources/scripts/[name]-[chunkhash].map',
    chunkFilename: './resources/scripts/[id].chunk.js'
};

module.exports = config;