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

const processParamsType = function(parameter){
    if (parameter.type === 'integer') {
        parameter.type = 'Number';
    }
}

const processMethod = function(method){
    let parameters = method.parameters;
    if(parameters){
        let params = parameters.map(p=>p.name)
        method.params = _.join(params,',')
        _.forEach(parameters,processParamsType);
    }
    

    let path = method.path;
    if(path && path.indexOf('{')>-1){
        method.path = path.replace('{','${');
    }
}

/**
 * Codegen 预处理
 * @param {object} swagger 
 * @param {object} data 
 */
const preprocess = function (swagger, data) {
    _.forEach(data.methods, function (method, name) {
        processMethod(method);
    });
}

const buildTemplate = function (template) {
    let templates = __dirname;
    template.class = template.class || fs.readFileSync(`${templates}/${type}-class.mustache`, 'utf-8');
    template.method = template.method || fs.readFileSync(`${templates}/${type}-method.mustache`, 'utf-8');
    //template.type = template.type || fs.readFileSync(`${templates}/type.mustache`, 'utf-8');
}

module.exports = {
    type, lintOptions,
    preprocess, buildTemplate
}