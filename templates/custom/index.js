'use strict';
const _ = require('lodash');

const type = 'custom';

const lintOptions = {};

const preprocess = function (swagger, data) {
    console.log(`Start CodeGen preprocess ${type}`);
};

const loadTemplates = function (opts) {
    return opts.template;
};

const generate = function (opts, mustache, data) {
    let templates = loadTemplates(opts);
    return {
        name: data.className,
        fileName: `${data.className}.js`,
        source: mustache.render(templates.class, data, templates)
    };
};

module.exports = {
    lintOptions,
    preprocess, loadTemplates, generate
};