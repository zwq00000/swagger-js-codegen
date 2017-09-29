const fs = require('fs');
const _ = require('lodash');

const type = 'axios';
const lintOptions = {
    node: false,
    browser: type === 'angular' || type === 'custom' || type === 'react',
    undef: true,
    strict: true,
    trailing: true,
    smarttabs: true,
    maxerr: 999
};

const processParamsType = function (parameter) {
    if (parameter.type === 'integer') {
        parameter.type = 'Number';
    }
}

const processMethod = function (method) {
    let parameters = method.parameters;
    if (parameters) {
        let params = parameters.map(p => p.name)
        method.params = _.join(params, ',')
        _.forEach(parameters, processParamsType);
    }


    let path = method.path;
    if (path && path.indexOf('{') > -1) {
        method.path = path.replace('{', '${');
    }
}

const filterClasses = function (data) {
    data.classes = [];
    let classes = _.groupBy(data.methods, (method, name) => {
        return method.className;
    });
    _.forEach(classes, (methods, className) => {
        let classDef = { className, methods };
        classDef.methodNames = _.map(methods, 'methodName').join(',');
        data.classes.push(classDef);
    });
}

/**
 * @method
 * @name  Codegen 预处理
 * @param {object} swagger  @description swagger object
 * @param {object} data     @description Codegen object
 */
const preprocess = function (swagger, data) {
    _.forEach(data.methods, function (method, name) {
        processMethod(method);
    });
    filterClasses(data);
}

const loadTemplates = function (opts) {
    let templates = __dirname;
    return {
        class: fs.readFileSync(`${templates}/${type}-class.mustache`, 'utf-8'),
        method: fs.readFileSync(`${templates}/${type}-method.mustache`, 'utf-8')
    }
}
const generate = function (opts, mustache, data) {
    templates = loadTemplates();
    let results = [];
    results.push({
        name: 'fetch',
        fileName: 'fetch.js',
        source: mustache.render(templates.fetch, data, templates)
    });
    _.map(data.classes, c => {
        data.templateFuncs(c);
        results.push({
            name: c.className,
            fileName: `${c.className}.js`,
            source: mustache.render(templates.class, c, templates)
        });
    });
    return results;
};

module.exports = {
    lintOptions,
    preprocess, loadTemplates, generate
}