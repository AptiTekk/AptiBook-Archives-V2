/*
 * Copyright (C) 2016 AptiTekk, LLC. (https://AptiTekk.com/) - All Rights Reserved
 * Unauthorized copying of any part of AptiBook, via any medium, is strictly prohibited.
 * Proprietary and confidential.
 */

var config = require('./webpack.common.config.js');

var path = require('path');

config.output = {
    path: path.join(__dirname, '../src/main/webapp/'),
    filename: './resources/scripts/[chunkhash].js',
    chunkFilename: './resources/scripts/[id].chunk.js'
};

module.exports = config;