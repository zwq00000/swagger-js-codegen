'use strict';

var Mustache = require('mustache');
var beautify = require('js-beautify').js_beautify;
var lint = require('jshint').JSHINT;
var _ = require('lodash');
var swagger1 = require('./swagger1View');
var swagger2 = require('./swagger2View');
var templateFuncs = require('./templateFunctions.js');

const getLintOptions = function () {
    return {
        node: false,
        browser: false,
        undef: true,
        strict: true,
        trailing: true,
        smarttabs: true,
        maxerr: 999
    };
};


const beautifySource = function (item) {
    let source = item.source;
    item.source = beautify(source, { indent_size: 4, max_preserve_newlines: 2 });
};

const lintSource = function (lintOptions, item) {
    let source = item.source;
    lint(source, lintOptions);
    lint.errors.forEach(function (error) {
        if (error.code[0] === 'E') {
            throw new Error(error.reason + ' in ' + error.evidence + ' (' + error.code + ')');
        }
    });
};

/**
 * generate Code for template
 * @param {*} opts 
 * @param {string} templateName 
 */
const generate = function (opts, templateName) {
    // For Swagger Specification version 2.0 value of field 'swagger' must be a string '2.0'
    var data = opts.swagger.swagger === '2.0' ? swagger2.getView(opts, templateName) : swagger1.getView(opts, templateName);
    var builder = require(`../templates/${templateName}`);
    builder.preprocess(opts.swagger, data);

    let lintOptions = getLintOptions();

    if (builder.lintOptions) {
        _.assign(lintOptions, builder.lintOptions);
    }

    if (opts.mustache) {
        _.assign(data, opts.mustache);
    }

    templateFuncs(data);
    data.templateFuncs = templateFuncs;

    var results = builder.generate(opts, Mustache, data);
    _.forEach(results, (item) => {
        if (opts.lint) {
            lintSource(lintOptions, item);
        }
        if (opts.beautify) {
            beautifySource(opts, item);
        }
    });

    return results;
};

const genCode = function (opts, templateName) {
    let results = generate(opts, templateName);
    return _.map(results, 'source').join('\r\n');
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
    genCode,
    generate

};
