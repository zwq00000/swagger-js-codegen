'use strict';

var Mustache = require('mustache');
var beautify = require('js-beautify').js_beautify;
var lint = require('jshint').JSHINT;
var _ = require('lodash');
var swagger1 = require('./swagger1View');
var swagger2 = require('./swagger2View');

const assignInternalFunc = function (data) {
    data.lower = function () {
        return function (text, render) {
            //wrong line return render(text.toLowerCase());
            return render(text).toLowerCase();
        };
    };
};

/**
 * generate Code for template
 * @param {*} opts 
 * @param {string} templateName 
 */
const genCode = function (opts, templateName) {
    // For Swagger Specification version 2.0 value of field 'swagger' must be a string '2.0'
    var data = opts.swagger.swagger === '2.0' ? swagger2.getView(opts, templateName) : swagger1.getView(opts, templateName);
    if (!_.isObject(opts.template)) {
        opts.template = {};
    }
    var builder = require(`../templates/${templateName}`);
    builder.preprocess(opts.swagger, data);
    assignInternalFunc(data);
    // 构建模板
    builder.buildTemplate(opts.template);

    if (!_.isObject(opts.template) || !_.isString(opts.template.class) || !_.isString(opts.template.method)) {
        throw new Error('Unprovided custom template. Please use the following template: template: { class: "...", method: "...", request: "..." }');
    }

    if (opts.mustache) {
        _.assign(data, opts.mustache);
    }

    var source = Mustache.render(opts.template.class, data, opts.template);
    var lintOptions = {
        node: templateName === 'node' || templateName === 'custom',
        browser: templateName === 'angular' || templateName === 'custom' || templateName === 'react',
        undef: true,
        strict: true,
        trailing: true,
        smarttabs: true,
        maxerr: 999
    };
    if (builder.lintOptions) {
        _.assign(lintOptions, builder.lintOptions);
    }

    if (opts.lint === undefined || opts.lint === true) {
        lint(source, lintOptions);
        lint.errors.forEach(function (error) {
            if (error.code[0] === 'E') {
                throw new Error(error.reason + ' in ' + error.evidence + ' (' + error.code + ')');
            }
        });
    }
    if (opts.beautify === undefined || opts.beautify === true) {
        return beautify(source, { indent_size: 4, max_preserve_newlines: 2 });
    } else {
        return source;
    }
};



exports.CodeGen = {
    getTypescriptCode: function (opts) {
        if (opts.swagger.swagger !== '2.0') {
            throw 'Typescript is only supported for Swagger 2.0 specs.';
        }
        opts.lint = false;
        return genCode(opts, 'typescript');
    },
    getAngularCode: function (opts) {
        return genCode(opts, 'angular');
    },
    getNodeCode: function (opts) {
        return genCode(opts, 'node');
    },
    getReactCode: function (opts) {
        return genCode(opts, 'react');
    },
    getCustomCode: function (opts) {
        return genCode(opts, 'custom');
    },
    getAxiosCode: function (opts) {
        return genCode(opts, 'axios');
    },
    genCode: function (opts, templateName) {
        return genCode(opts, templateName);
    }
};
