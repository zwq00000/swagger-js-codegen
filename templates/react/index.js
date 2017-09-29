'use strict';
const fs = require('fs');
const _ = require('lodash');

const type = 'react';

const lintOptions = {};

const preprocess = function (swagger, data) {
    console.log(`Start CodeGen preprocess ${type}`);

};

const loadTemplates = function (opts) {
    return {
        class: fs.readFileSync(`${__dirname}/react-class.mustache`, 'utf-8'),
        method: fs.readFileSync(`${__dirname}/method.mustache`, 'utf-8')
    };
};
const generate = function (opts, mustache, data) {
    let templates = loadTemplates(opts);
    return {
        name: opts.moduleName,
        fileName: `${opts.moduleName}.js`,
        source: mustache.render(templates.class, data, templates)
    };
};

module.exports = {
    lintOptions,
    preprocess, loadTemplates, generate
};