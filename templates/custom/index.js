'use strict';
const _ = require('lodash');

const type = 'custom';

const lintOptions={}

const preprocess=function(swagger,data){
    console.log(`Start CodeGen preprocess ${type}`);
}

const buildTemplate=function(opts){
    if (!_.isObject(opts.template) || !_.isString(opts.template.class)  || !_.isString(opts.template.method)) {
       // throw new Error('Unprovided custom template. Please use the following template: template: { class: "...", method: "...", request: "..." }');
    }
}

module.exports = {
    type, lintOptions,
    preprocess, buildTemplate
}