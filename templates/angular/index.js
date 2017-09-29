'use strict';
const fs = require('fs');
const _ = require('lodash');


const lintOptions = {}

const preprocess = function (swagger, data) {
    console.log(`Start CodeGen preprocess angular`);
}

const loadTemplates = function (template) {
    let templates = __dirname;
    return {
        class: fs.readFileSync(`${templates}/angular-class.mustache`, 'utf-8'),
        method: fs.readFileSync(`${templates}/method.mustache`, 'utf-8')
    }
}

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
}