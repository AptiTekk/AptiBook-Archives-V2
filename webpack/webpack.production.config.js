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
        use: '@ngtools/webpack',
        exclude: [/\.(spec|e2e)\.ts$/]
    }
);

config.plugins.push(
    new AotPlugin({
        tsConfigPath: path.join(__dirname, '../tsconfig.json'),
        entryModule: path.join(__dirname, '../src/frontend/scripts/app.module#AppModule')
    })
);

config.output = {
    path: path.join(__dirname, '../src/main/webapp/'),
    filename: './resources/scripts/[name]-[chunkhash].js',
    chunkFilename: './resources/scripts/[id].chunk.js'
};

module.exports = config;