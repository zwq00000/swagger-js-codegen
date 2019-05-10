'use strict';

var _ = require('lodash');
const ts = require('./typescript');

const authorizedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLIK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND'];

let swagger = {};
let _methodNames = [];
/**
 * parameters with current path
 */
let _pathParams = [];

let _currentPath = '';

/**
 * get swagger file parameters
 * @param {string} $ref 引用
 */
const getRefParameter = function ($ref) {
    var segments = $ref.split('/');
    return swagger.parameters[segments.length === 1 ? segments[0] : segments[2]];
};

const getSecureTypes = function (op) {
    var secureTypes = [];
    if (swagger.securityDefinitions !== undefined || op.security !== undefined) {
        var mergedSecurity = _.merge([], swagger.security, op.security).map(function (security) {
            return Object.keys(security);
        });
        if (swagger.securityDefinitions) {
            for (var sk in swagger.securityDefinitions) {
                if (mergedSecurity.join(',').indexOf(sk) !== -1) {
                    secureTypes.push(swagger.securityDefinitions[sk].type);
                }
            }
        }
    }
    return secureTypes;
};

/**
 * check method name is RESTful method
 * @param {string} methodName 
 */
const isRestMethod = function (methodName) {
    var upperName = methodName.toUpperCase();
    return (upperName && authorizedMethods.indexOf(upperName) > -1);
};

const normalizeName = function (id) {
    return id.replace(/\.|\-|\{|\}/g, '_');
};

const getPathToMethodName = function (m, path) {
    if (path === '/' || path === '') {
        return m;
    }

    // clean url path for requests ending with '/'
    var cleanPath = path.replace(/\/$/, '');

    var segments = cleanPath.split('/').slice(1);
    segments = _.transform(segments, function (result, segment) {
        if (segment[0] === '{' && segment[segment.length - 1] === '}') {
            segment = 'by' + segment[1].toUpperCase() + segment.substring(2, segment.length - 1);
        }
        result.push(segment);
    });
    var result = _.camelCase(segments.join('-'));
    return m.toLowerCase() + result[0].toUpperCase() + result.substring(1);
};

const parseParameter = function (parameter) {
    parameter.camelCaseName = _.camelCase(parameter.name);
    if (parameter.enum && parameter.enum.length === 1) {
        parameter.isSingleton = true;
        parameter.singleton = parameter.enum[0];
    }
    switch (parameter.in) {
        case 'body':
            parameter.isBodyParameter = true;
            break;
        case 'path':
            parameter.isPathParameter = true;
            break;
        case 'query':
            parameter.isQueryParameter = true;
            if (parameter['x-name-pattern']) {
                parameter.isPatternType = true;
                parameter.pattern = parameter['x-name-pattern'];
            }
            break;
        case 'header':
            parameter.isHeaderParameter = true;
            break;
        case 'formData':
            parameter.isFormParameter = true;
            break;
    }
    // move to template/typescript/index.js
    parameter.tsType = ts.convertType(parameter);
    parameter.cardinality = parameter.required ? '' : '?';
};

const parseParameters = function (op, method) {
    var params = [];
    if (_.isArray(op.parameters)) {
        params = op.parameters;
    }
    params = params.concat(_pathParams);
    _.forEach(params, function (parameter) {
        //Ignore parameters which contain the x-exclude-from-bindings extension
        if (parameter['x-exclude-from-bindings'] === true) {
            return;
        }

        // Ignore headers which are injected by proxies & app servers
        // eg: https://cloud.google.com/appengine/docs/go/requests#Go_Request_headers
        if (parameter['x-proxy-header']) {
            return;
        }
        if (_.isString(parameter.$ref)) {
            parameter = getRefParameter(parameter.$ref);
        }
        parseParameter(parameter);
        method.parameters.push(parameter);
    });
};

const getMethodName = function (op, name) {
    var methodName = (op.operationId ? normalizeName(op.operationId) : getPathToMethodName(name, _currentPath));
    // Make sure the method name is unique
    if (_methodNames.indexOf(methodName) !== -1) {
        var i = 1;
        while (true) {
            if (_methodNames.indexOf(methodName + '_' + i) !== -1) {
                i++;
            } else {
                methodName = methodName + '_' + i;
                break;
            }
        }
    }
    _methodNames.push(methodName);
    return methodName;
};

/**
 * 
 * @param {*} op 
 * @param {*} method 
 * @param {function} handle @description parseHandle(method,swagger)
 */
const parseMethod = function (op, m, handle) {
    if (!isRestMethod(m)) {
        return;
    }
    var secureTypes = getSecureTypes(op);

    let methodName = getMethodName(op, m);
    let upperMethodName = m.toUpperCase();

    var method = {
        methodName: methodName,
        method: upperMethodName,
        isGET: upperMethodName === 'GET',
        isPOST: upperMethodName === 'POST',
        summary: op.description || op.summary,
        externalDocs: op.externalDocs,
        isSecure: swagger.security !== undefined || op.security !== undefined,
        isSecureToken: secureTypes.indexOf('oauth2') !== -1,
        isSecureApiKey: secureTypes.indexOf('apiKey') !== -1,
        isSecureBasic: secureTypes.indexOf('basic') !== -1,
        parameters: [],
        headers: []
    };

    var produces = op.produces || swagger.produces;
    if (produces) {
        method.headers.push({
            name: 'Accept',
            value: `'${produces.map(function (value) { return value; }).join(', ')}'`
        });
    }

    var consumes = op.consumes || swagger.consumes;
    if (consumes) {
        method.headers.push({ name: 'Content-Type', value: '\'' + consumes + '\'' });
    }
    let parameter = parseParameters(op, method);
    if (parameter) {
        method.parameters.push(parameter);
    }

    if (handle) {
        handle(method, swagger);
    }
    return method;
};

/**
 * get class Name from tags or path
 * @param {Array} swagger.tags 
 * @param {string} path
 */
const getClassName = function(tags, path){
    if(tags){
        return tags[0]
    }
    return getPathName(path);
}

/**
 * get path primer name
 * @param {string} path 
 */
const getPathName = function (path) {
    if (!path || path === '' || path === '/') {
        return 'default';
    }
    var reg = /\/?(\w+)\/?/;
    return path.match(reg)[1];
};

/**
 * 
 * @param {swagger.path} api  swagger.paths[]
 * @param {string} path @description path string
 */
const parsePath = function (api, path) {
    _pathParams = [];
    _methodNames = [];
    let methods = [];
    _currentPath = path;
    /**
     * @param {Object} op - meta data for the request
     * @param {string} m - HTTP method name - eg: 'get', 'post', 'put', 'delete'
     */
    if (api.parameters) {
        _pathParams = api.parameters;
    }

    _.forEach(api, function (op, methodName) {
        let method = parseMethod(op, methodName);
        if (method) {
            method.path = path;
            method.className = getClassName(op.tags,path);
            methods.push(method);
        }
    });

    return methods;
};

const filterSecure = function (data) {
    _.forEach(data.methods, (method) => {
        if (method.isSecure && method.isSecureToken) {
            data.isSecureToken = method.isSecureToken;
        }
        if (method.isSecure && method.isSecureApiKey) {
            data.isSecureApiKey = method.isSecureApiKey;
        }
        if (method.isSecure && method.isSecureBasic) {
            data.isSecureBasic = method.isSecureBasic;
        }
    });
};

const getView = function (opts, type) {
    swagger = opts.swagger;
    let data = {
        isNode: type === 'node' || type === 'react',
        isES6: opts.isES6 || type === 'react',
        description: swagger.info.description,
        isSecure: swagger.securityDefinitions !== undefined,
        moduleName: opts.moduleName,
        className: opts.className,
        imports: opts.imports,
        domain: (swagger.schemes && swagger.schemes.length > 0 && swagger.host && swagger.basePath) ? swagger.schemes[0] + '://' + swagger.host + swagger.basePath.replace(/\/+$/g, '') : '',
        methods: [],
        definitions: []
    };
    _.forEach(swagger.paths, function (api, path) {
        let methods = parsePath(api, path);
        if (methods) {
            data.methods = data.methods.concat(methods);
        }
    });
    filterSecure(data);

    _.forEach(swagger.definitions, function (definition, name) {
        data.definitions.push({
            name: name,
            description: definition.description,
            title: definition.title,
            // move to template/typescript/index.js
            tsType: ts.convertType(definition, swagger)
        });
    });
    return data;
};

/*
const getViewForSwagger2 = function (opts, type) {
    swagger = opts.swagger;
    let methods = [];

    let data = {
        isNode: type === 'node' || type === 'react',
        isES6: opts.isES6 || type === 'react',
        description: swagger.info.description,
        isSecure: swagger.securityDefinitions !== undefined,
        moduleName: opts.moduleName,
        className: opts.className,
        imports: opts.imports,
        domain: (swagger.schemes && swagger.schemes.length > 0 && swagger.host && swagger.basePath) ? swagger.schemes[0] + '://' + swagger.host + swagger.basePath.replace(/\/+$/g, '') : '',
        methods: [],
        definitions: []
    };

    _.forEach(swagger.paths, function (api, path) {
        var globalParams = [];
         // @param {Object} op - meta data for the request
         // @param {string} m - HTTP method name - eg: 'get', 'post', 'put', 'delete'
        _.forEach(api, function (op, m) {
            if (m.toLowerCase() === 'parameters') {
                globalParams = op;
            }
        });
        _.forEach(api, function (op, m) {
            var M = m.toUpperCase();
            if (M === '' || authorizedMethods.indexOf(M) === -1) {
                return;
            }
            var secureTypes = [];
            if (swagger.securityDefinitions !== undefined || op.security !== undefined) {
                var mergedSecurity = _.merge([], swagger.security, op.security).map(function (security) {
                    return Object.keys(security);
                });
                if (swagger.securityDefinitions) {
                    for (var sk in swagger.securityDefinitions) {
                        if (mergedSecurity.join(',').indexOf(sk) !== -1) {
                            secureTypes.push(swagger.securityDefinitions[sk].type);
                        }
                    }
                }
            }
            var methodName = (op.operationId ? normalizeName(op.operationId) : getPathToMethodName(opts, m, path));
            // Make sure the method name is unique
            if (methods.indexOf(methodName) !== -1) {
                var i = 1;
                while (true) {
                    if (methods.indexOf(methodName + '_' + i) !== -1) {
                        i++;
                    } else {
                        methodName = methodName + '_' + i;
                        break;
                    }
                }
            }
            methods.push(methodName);

            var method = {
                path: path,
                className: opts.className,
                methodName: methodName,
                method: M,
                isGET: M === 'GET',
                isPOST: M === 'POST',
                summary: op.description || op.summary,
                externalDocs: op.externalDocs,
                isSecure: swagger.security !== undefined || op.security !== undefined,
                isSecureToken: secureTypes.indexOf('oauth2') !== -1,
                isSecureApiKey: secureTypes.indexOf('apiKey') !== -1,
                isSecureBasic: secureTypes.indexOf('basic') !== -1,
                parameters: [],
                headers: []
            };
            if (method.isSecure && method.isSecureToken) {
                data.isSecureToken = method.isSecureToken;
            }
            if (method.isSecure && method.isSecureApiKey) {
                data.isSecureApiKey = method.isSecureApiKey;
            }
            if (method.isSecure && method.isSecureBasic) {
                data.isSecureBasic = method.isSecureBasic;
            }
            var produces = op.produces || swagger.produces;
            if (produces) {
                method.headers.push({
                    name: 'Accept',
                    value: `'${produces.map(function (value) { return value; }).join(', ')}'`
                });
            }

            var consumes = op.consumes || swagger.consumes;
            if (consumes) {
                method.headers.push({ name: 'Content-Type', value: '\'' + consumes + '\'' });
            }

            var params = [];
            if (_.isArray(op.parameters)) {
                params = op.parameters;
            }
            params = params.concat(globalParams);
            _.forEach(params, function (parameter) {
                //Ignore parameters which contain the x-exclude-from-bindings extension
                if (parameter['x-exclude-from-bindings'] === true) {
                    return;
                }

                // Ignore headers which are injected by proxies & app servers
                // eg: https://cloud.google.com/appengine/docs/go/requests#Go_Request_headers
                if (parameter['x-proxy-header'] && !data.isNode) {
                    return;
                }
                if (_.isString(parameter.$ref)) {
                    var segments = parameter.$ref.split('/');
                    parameter = swagger.parameters[segments.length === 1 ? segments[0] : segments[2]];
                }
                parameter.camelCaseName = _.camelCase(parameter.name);
                if (parameter.enum && parameter.enum.length === 1) {
                    parameter.isSingleton = true;
                    parameter.singleton = parameter.enum[0];
                }
                if (parameter.in === 'body') {
                    parameter.isBodyParameter = true;
                } else if (parameter.in === 'path') {
                    parameter.isPathParameter = true;
                } else if (parameter.in === 'query') {
                    if (parameter['x-name-pattern']) {
                        parameter.isPatternType = true;
                        parameter.pattern = parameter['x-name-pattern'];
                    }
                    parameter.isQueryParameter = true;
                } else if (parameter.in === 'header') {
                    parameter.isHeaderParameter = true;
                } else if (parameter.in === 'formData') {
                    parameter.isFormParameter = true;
                }
                // move to template/typescript/index.js
                parameter.tsType = ts.convertType(parameter);
                parameter.cardinality = parameter.required ? '' : '?';
                method.parameters.push(parameter);
            });
            data.methods.push(method);
        });
    });

    _.forEach(swagger.definitions, function (definition, name) {
        data.definitions.push({
            name: name,
            description: definition.description,
            // move to template/typescript/index.js
            tsType: ts.convertType(definition, swagger)
        });
    });

    return data;
};
*/

module.exports = {
    'getView': getView,
    parseMethod,
    parsePath,
    swagger
};