#!/bin/env node
(function () {
    'use strict';

    var express = require('express'),
        app = express();

    app
        .use(express.static(__dirname + '/'))
        .listen(process.env.PORT || 3000, function () {
            console.log('Listening @ port 3000...');
        });
}());