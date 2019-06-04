const fs = require('fs');
const _ = require('lodash');

const type = 'axios';
const lintOptions = {
    node: false,
    browser: true,
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
};

//是否包含分页方法
const isPagedMethod = function(method){
    return method.parameters.find(p=>p.name === 'PageSize')
}

const getMockEntre = function(method){
    let path = method.path;
    let url = path;
    if (path && path.indexOf('${') > -1) {
        url = path.replace(/\$\{(([a-zA-Z]+))\}/g,':$1');
    }
    //let hasPathParams = method.parameters.includes(i=>i.isPathParameter);
    let pathParams = method.parameters.filter(p=>p.isPathParameter);
    let dataName = `${method.className}Data`;
    if(method.isGET){
        if(pathParams.length===1){
            return `'${method.method} ${url}': (req,res)=> mock.getById(req.params.${pathParams[0].name},res,${dataName}),`;
        }else if(pathParams.length>1) {
            let params =   pathParams.map(p=>`${p.name} : req.params.${p.name}`).join(',');
            return `'${method.method} ${url}': (req,res)=> mock.queryData({${params}},res,${dataName}),`;
        }else{
            if(isPagedMethod(method)){
                //use page data
                return `'${method.method} ${url}': (req,res)=> mock.toPage(req,res,${dataName}),`;
            }else{
                return `'${method.method} ${url}': ${dataName},`;
            }
        }
    }
    if(method.isDELETE){
        if(pathParams.length>0){
            return `'${method.method} ${url}': (req,res)=> mock.deleteById(req.params.${pathParams[0].name},res,${dataName}),`;
        }else{
            return `'${method.method} ${url}': (req,res)=> mock.deleteItem(req,res,${dataName}),`;
        }
    }
    if(method.isPUT){
        return `'${method.method} ${url}': (req,res)=> mock.update(req,res,${dataName}),`;
    }
    if(method.isPOST){
        return `'${method.method} ${url}': (req,res)=> mock.create(req,res,${dataName}),`;
    }
    return `'${method.method} ${url}': (req,res)=>${method.method}{},`;
};

const processMethod = function (method) {
    let parameters = method.parameters;
    if (parameters) {
        let params = parameters.map(p => p.name);
        method.params = _.join(params, ',');
        _.forEach(parameters, processParamsType);
    }


    let path = method.path;
    method.url = path;
    if (path && path.indexOf('{') > -1) {
        method.path = path.replace(/{/g, '${');
    }
    method.isPUT = method.method === 'PUT';
    method.isDELETE = method.method === 'DELETE';
    method.mockEntry = getMockEntre(method);
};

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
};

/**
 * @method
 * @name  Codegen 预处理
 * @param {object} swagger  @description swagger object
 * @param {object} data     @description Codegen object
 */
const preprocess = function (swagger, data) {
    _.forEach(data.methods, function (method, name) {
        processMethod(method);
        //console.log(method)
    });
    filterClasses(data);
};

const loadTemplates = function () {
    return {
        class: fs.readFileSync(`${__dirname}/axios-class.mustache`, 'utf-8'),
        method: fs.readFileSync(`${__dirname}/axios-method.mustache`, 'utf-8'),
        //fetch: fs.readFileSync(`${__dirname}/fetch.mustache`, 'utf-8'),
        mockapi: fs.readFileSync(`${__dirname}/mockapi.mustache`, 'utf-8'),
        classDef:fs.readFileSync(`${__dirname}/classDef.mustache`,'utf-8')
    };
};

const generate = function (opts, mustache, data) {
    templates = loadTemplates();
    let results = [];
    results.push({
        name: 'mockapi',
        fileName: 'mockapi.js',
        source: mustache.render(templates.mockapi, data, templates)
    });
    
    _.map(data.classes, c => {
        data.templateFuncs(c);
        results.push({
            name: c.className,
            fileName: `${c.className}Api.js`,
            source: mustache.render(templates.class, c, templates)
        });
    });
    _.map(data.definitions,d=>{
        results.push({
            name: d.name,
            fileName: `model\\${d.name}.ts`,
            source: mustache.render(templates.classDef, d, templates)
        });
    });
    return results;
};




module.exports = {
    lintOptions,
    preprocess,
    loadTemplates,
    generate
};