'use strict';
const fs = require('fs');
const _ = require('lodash');

const type='react'

const lintOptions={}

const preprocess=function(swagger,data){
    console.log(`Start CodeGen preprocess ${type}`);

}

const buildTemplate=function(template){
    let templates = __dirname;
    template.class = template.class || fs.readFileSync(`${templates}/${type}-class.mustache`, 'utf-8');
    template.method = template.method || fs.readFileSync(`${templates}/method.mustache`, 'utf-8');
    //if (!_.isObject(opts.template) || !_.isString(opts.template.class)  || !_.isString(opts.template.method)) {
    //    throw new Error('Unprovided custom template. Please use the following template: template: { class: "...", method: "...", request: "..." }');
   // }
}

module.exports = {
    type, lintOptions,
    preprocess, buildTemplate
}