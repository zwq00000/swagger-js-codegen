/**
 * sample for template index.js
 */
const fs = require('fs');
const _ = require('lodash');

var type = 'default';
var lintOptions = {};

/**
 * Codegen 预处理
 * @param {object} swagger  @description swagger
 * @param {object} data  @description CodeGen target
 */
const preprocess = function (swagger, data) {
    console.log('Start preprocess for ' + type);
};

/**
 * 构建 模板内容
 * @param {object} template @description a template object
 */
const loadTemplates = function (template) {

};

module.exports = {
    type, lintOptions,
    preprocess, loadTemplates
};