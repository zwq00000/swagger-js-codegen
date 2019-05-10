
import * as request from "superagent";
import {SuperAgentStatic} from "superagent";

type CallbackHandler = (err: any, res?: request.Response) => void;
type Workpiece = any
;
type Workpieces = any
;
type PagedWorkpieces = any
;
type CpSpec = any
;
type TaskSession = any
;
type PagedTaskSessions = any
;
type MeasureRecord = any
;
type MeasureValue = any
;
type User = any
;
type PagedUsers = any
;
type UserInfo = any
;
type LoginInfo = any
;
type Paging = any
;
type Error = any
;
type ModelStateDictionary = any
;

type Logger = { log: (line: string) => any };

/**
 * This is a ProIn data access WebApi
 * @class 
 * @param {(string)} [domainOrOptions] - The project domain.
 */
export default class  {

    private domain: string = "";
    private errorHandlers: CallbackHandler[] = [];

    constructor(domain?: string, private logger?: Logger) {
        if(domain) {
            this.domain = domain;
        }
    }

    getDomain() {
        return this.domain;
    }

    addErrorHandler(handler: CallbackHandler) {
        this.errorHandlers.push(handler);
    }

    private request(method: string, url: string, body: any, headers: any, queryParameters: any, form: any, reject: CallbackHandler, resolve: CallbackHandler) {
        if(this.logger) {
          this.logger.log(`Call ${method} ${url}`);
        }

        let req = (request as SuperAgentStatic)(method, url).query(queryParameters);

        Object.keys(headers).forEach(key => {
            req.set(key, headers[key]);
        });

        if(body) {
            req.send(body);
        }
        
        if(typeof(body) === 'object' && !(body.constructor.name === 'Buffer')) {
            req.set('Content-Type', 'application/json');
        }

        if(Object.keys(form).length > 0) {
            req.type('form');
            req.send(form);
        }

        req.end((error, response) => {
            if(error || !response.ok) {
                reject(error);
                this.errorHandlers.forEach(handler => handler(error));
            } else {
                resolve(response);
            }
        });
    }

getWorkpiecesURL(parameters: {
'pageSize'?: 10 | 20 | 50 | 100
,
'pageNumber'?: number
,
'searchStr'?: string
,
'category'?: string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces';
                    if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                    }

                    if(parameters['pageNumber'] !== undefined){
                    queryParameters['pageNumber'] = parameters['pageNumber'];
                    }

                    if(parameters['searchStr'] !== undefined){
                    queryParameters['searchStr'] = parameters['searchStr'];
                    }

                    if(parameters['category'] !== undefined){
                    queryParameters['category'] = parameters['category'];
                    }

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* Returns a list of all workpieces,the list supports paging.
* @method
* @name workpieces#getWorkpieces
     * @param {integer} pageSize - 页面大小
     * @param {integer} pageNumber - 页码，从 0 开始
     * @param {string} searchStr - 搜索关键词
     * @param {string} category - 工件分类名称
*/
getWorkpieces(parameters: {
'pageSize'?: 10 | 20 | 50 | 100
,
'pageNumber'?: number
,
'searchStr'?: string
,
'category'?: string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';


                if(parameters['pageSize'] !== undefined) {
                    queryParameters['pageSize'] = parameters['pageSize'];
                }







                if(parameters['pageNumber'] !== undefined) {
                    queryParameters['pageNumber'] = parameters['pageNumber'];
                }







                if(parameters['searchStr'] !== undefined) {
                    queryParameters['searchStr'] = parameters['searchStr'];
                }







                if(parameters['category'] !== undefined) {
                    queryParameters['category'] = parameters['category'];
                }







if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

createWorkpieceURL(parameters: {
'workpiece'?: Workpiece
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces';

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }

    queryParameters = {};


    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* Adds a new workpiece to the workpieces list.
* @method
* @name workpieces#createWorkpiece
     * @param {} workpiece - The workpiece to create.
*/
createWorkpiece(parameters: {
'workpiece'?: Workpiece
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';





        if(parameters['workpiece'] !== undefined) {
            body = parameters['workpiece'];
        }




if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}

            form = queryParameters;
            queryParameters = {};

    this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

updateWorkpieceURL(parameters: {
'workpiece': Workpiece
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces';

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 修改并更新一个 Workpiece 实例
* @method
* @name workpieces#updateWorkpiece
     * @param {} workpiece - This is a ProIn data access WebApi
*/
updateWorkpiece(parameters: {
'workpiece': Workpiece
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';





        if(parameters['workpiece'] !== undefined) {
            body = parameters['workpiece'];
        }


        if(parameters['workpiece'] === undefined) {
            reject(new Error('Missing required  parameter: workpiece'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getWorkpieceURL(parameters: {
'partId': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces/{partId}';

            path = path.replace('{partId}', `${parameters['partId']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* return a single workpiece for its partId
* @method
* @name workpieces#getWorkpiece
     * @param {string} partId - The Workpiece PartId
*/
getWorkpiece(parameters: {
'partId': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces/{partId}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';



        path = path.replace('{partId}', `${parameters['partId']}`);




        if(parameters['partId'] === undefined) {
            reject(new Error('Missing required  parameter: partId'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

deleteWorkpieceURL(parameters: {
'partId': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces/{partId}';

            path = path.replace('{partId}', `${parameters['partId']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* delete a workpiece
* @method
* @name workpieces#deleteWorkpiece
     * @param {string} partId - The Workpiece PartId
*/
deleteWorkpiece(parameters: {
'partId': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces/{partId}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';



        path = path.replace('{partId}', `${parameters['partId']}`);




        if(parameters['partId'] === undefined) {
            reject(new Error('Missing required  parameter: partId'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('DELETE', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getCpspecsByPartIdURL(parameters: {
'partId': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces/{partId}/cpspecs';

            path = path.replace('{partId}', `${parameters['partId']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* get a cpspec list in thie workpiece
* @method
* @name workpieces#getCpspecsByPartId
     * @param {string} partId - the Workpiece PartId
*/
getCpspecsByPartId(parameters: {
'partId': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/workpieces/{partId}/cpspecs';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';



        path = path.replace('{partId}', `${parameters['partId']}`);




        if(parameters['partId'] === undefined) {
            reject(new Error('Missing required  parameter: partId'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getCategoriesURL(parameters: {
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/categories';
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 获取工件分类列表
* @method
* @name categories#getCategories
*/
getCategories(parameters: {
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/categories';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getCpspecURL(parameters: {
'specId': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/cpspec/{specId}';

            path = path.replace('{specId}', `${parameters['specId']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* get a cpspec
* @method
* @name cpspec#getCpspec
     * @param {string} specId - The CpSpec Id
*/
getCpspec(parameters: {
'specId': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/cpspec/{specId}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';



        path = path.replace('{specId}', `${parameters['specId']}`);




        if(parameters['specId'] === undefined) {
            reject(new Error('Missing required  parameter: specId'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

createCpspecURL(parameters: {
'cpSpec'?: CpSpec
,
'specId': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/cpspec/{specId}';


            path = path.replace('{specId}', `${parameters['specId']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }

    queryParameters = {};


    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* Adds a new CpSpec to the CpSpecs list.
* @method
* @name cpspec#createCpspec
     * @param {} cpSpec - The cpspec to create.
     * @param {string} specId - The CpSpec Id
*/
createCpspec(parameters: {
'cpSpec'?: CpSpec
,
'specId': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/cpspec/{specId}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';





        if(parameters['cpSpec'] !== undefined) {
            body = parameters['cpSpec'];
        }





        path = path.replace('{specId}', `${parameters['specId']}`);




        if(parameters['specId'] === undefined) {
            reject(new Error('Missing required  parameter: specId'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}

            form = queryParameters;
            queryParameters = {};

    this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

updateCpspecURL(parameters: {
'cpspec': CpSpec
,
'specId': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/cpspec/{specId}';


            path = path.replace('{specId}', `${parameters['specId']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* modify a cpspec
* @method
* @name cpspec#updateCpspec
     * @param {} cpspec - This is a ProIn data access WebApi
     * @param {string} specId - The CpSpec Id
*/
updateCpspec(parameters: {
'cpspec': CpSpec
,
'specId': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/cpspec/{specId}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';





        if(parameters['cpspec'] !== undefined) {
            body = parameters['cpspec'];
        }


        if(parameters['cpspec'] === undefined) {
            reject(new Error('Missing required  parameter: cpspec'));
            return;
        }



        path = path.replace('{specId}', `${parameters['specId']}`);




        if(parameters['specId'] === undefined) {
            reject(new Error('Missing required  parameter: specId'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

deleteCpspecURL(parameters: {
'specId': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/cpspec/{specId}';

            path = path.replace('{specId}', `${parameters['specId']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* delete a CpSpec
* @method
* @name cpspec#deleteCpspec
     * @param {string} specId - The CpSpec Id
*/
deleteCpspec(parameters: {
'specId': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/cpspec/{specId}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';



        path = path.replace('{specId}', `${parameters['specId']}`);




        if(parameters['specId'] === undefined) {
            reject(new Error('Missing required  parameter: specId'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('DELETE', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getMeasureTasksURL(parameters: {
'pageSize'?: 10 | 20 | 50 | 100
,
'pageNumber'?: number
,
'partId'?: string
,
'startDate'?: string
,
'endDate'?: string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/taskSessions';
                    if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                    }

                    if(parameters['pageNumber'] !== undefined){
                    queryParameters['pageNumber'] = parameters['pageNumber'];
                    }

                    if(parameters['partId'] !== undefined){
                    queryParameters['partId'] = parameters['partId'];
                    }

                    if(parameters['startDate'] !== undefined){
                    queryParameters['startDate'] = parameters['startDate'];
                    }

                    if(parameters['endDate'] !== undefined){
                    queryParameters['endDate'] = parameters['endDate'];
                    }

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 获取已经完成的测量任务列表
* @method
* @name taskSessions#getMeasureTasks
     * @param {integer} pageSize - Number of items returned
     * @param {integer} pageNumber - Page number
     * @param {string} partId - 工件Id
     * @param {string} startDate - Task start Data Range,,if empty use today
     * @param {string} endDate - Task end Data Range,if empty use today
*/
getMeasureTasks(parameters: {
'pageSize'?: 10 | 20 | 50 | 100
,
'pageNumber'?: number
,
'partId'?: string
,
'startDate'?: string
,
'endDate'?: string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/taskSessions';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';


                if(parameters['pageSize'] !== undefined) {
                    queryParameters['pageSize'] = parameters['pageSize'];
                }







                if(parameters['pageNumber'] !== undefined) {
                    queryParameters['pageNumber'] = parameters['pageNumber'];
                }







                if(parameters['partId'] !== undefined) {
                    queryParameters['partId'] = parameters['partId'];
                }







                if(parameters['startDate'] !== undefined) {
                    queryParameters['startDate'] = parameters['startDate'];
                }







                if(parameters['endDate'] !== undefined) {
                    queryParameters['endDate'] = parameters['endDate'];
                }







if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

createTaskSessionURL(parameters: {
'taskSession'?: TaskSession
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/taskSessions';

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }

    queryParameters = {};


    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 测量完成后，提交测量结果
* @method
* @name taskSessions#createTaskSession
     * @param {} taskSession - measureTeask and values
*/
createTaskSession(parameters: {
'taskSession'?: TaskSession
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/taskSessions';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';





        if(parameters['taskSession'] !== undefined) {
            body = parameters['taskSession'];
        }




if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}

            form = queryParameters;
            queryParameters = {};

    this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getTaskSessionURL(parameters: {
'ssid': number
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/taskSessions/{ssid}';

            path = path.replace('{ssid}', `${parameters['ssid']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* get a taskSession by sessionId
* @method
* @name taskSessions#getTaskSession
     * @param {integer} ssid - This is a ProIn data access WebApi
*/
getTaskSession(parameters: {
'ssid': number
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/taskSessions/{ssid}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';



        path = path.replace('{ssid}', `${parameters['ssid']}`);




        if(parameters['ssid'] === undefined) {
            reject(new Error('Missing required  parameter: ssid'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getMeasureValueURL(parameters: {
'startDate'?: string
,
'endDate'?: string
,
'specId': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/measureValue/{specId}';
                    if(parameters['startDate'] !== undefined){
                    queryParameters['startDate'] = parameters['startDate'];
                    }

                    if(parameters['endDate'] !== undefined){
                    queryParameters['endDate'] = parameters['endDate'];
                    }


            path = path.replace('{specId}', `${parameters['specId']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 获取测量值(数值集合)
* @method
* @name measureValue#getMeasureValue
     * @param {string} startDate - 开始日期
     * @param {string} endDate - 结束日期
     * @param {string} specId - 检测项Id
*/
getMeasureValue(parameters: {
'startDate'?: string
,
'endDate'?: string
,
'specId': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/measureValue/{specId}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';


                if(parameters['startDate'] !== undefined) {
                    queryParameters['startDate'] = parameters['startDate'];
                }







                if(parameters['endDate'] !== undefined) {
                    queryParameters['endDate'] = parameters['endDate'];
                }








        path = path.replace('{specId}', `${parameters['specId']}`);




        if(parameters['specId'] === undefined) {
            reject(new Error('Missing required  parameter: specId'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getUsersURL(parameters: {
'pageSize'?: 10 | 20 | 50 | 100
,
'pageNumber'?: number
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/users';
                    if(parameters['pageSize'] !== undefined){
                    queryParameters['pageSize'] = parameters['pageSize'];
                    }

                    if(parameters['pageNumber'] !== undefined){
                    queryParameters['pageNumber'] = parameters['pageNumber'];
                    }

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 获取用户列表
* @method
* @name users#getUsers
     * @param {integer} pageSize - Number of items returned
     * @param {integer} pageNumber - Page number
*/
getUsers(parameters: {
'pageSize'?: 10 | 20 | 50 | 100
,
'pageNumber'?: number
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/users';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';


                if(parameters['pageSize'] !== undefined) {
                    queryParameters['pageSize'] = parameters['pageSize'];
                }







                if(parameters['pageNumber'] !== undefined) {
                    queryParameters['pageNumber'] = parameters['pageNumber'];
                }







if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

createUserURL(parameters: {
'user': User
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/users';

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }

    queryParameters = {};


    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 创建用户
* @method
* @name users#createUser
     * @param {} user - This is a ProIn data access WebApi
*/
createUser(parameters: {
'user': User
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/users';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';





        if(parameters['user'] !== undefined) {
            body = parameters['user'];
        }


        if(parameters['user'] === undefined) {
            reject(new Error('Missing required  parameter: user'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}

            form = queryParameters;
            queryParameters = {};

    this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

updateUserURL(parameters: {
'user': User
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/users';

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 更新用户数据
* @method
* @name users#updateUser
     * @param {} user - This is a ProIn data access WebApi
*/
updateUser(parameters: {
'user': User
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/users';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';





        if(parameters['user'] !== undefined) {
            body = parameters['user'];
        }


        if(parameters['user'] === undefined) {
            reject(new Error('Missing required  parameter: user'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('PUT', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getUserURL(parameters: {
'uid': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/users/{uid}';

            path = path.replace('{uid}', `${parameters['uid']}`);
    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 根据 UserId 获取用户实例
* @method
* @name users#getUser
     * @param {string} uid - This is a ProIn data access WebApi
*/
getUser(parameters: {
'uid': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/users/{uid}';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';



        path = path.replace('{uid}', `${parameters['uid']}`);




        if(parameters['uid'] === undefined) {
            reject(new Error('Missing required  parameter: uid'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

loginURL(parameters: {
'loginInfo'?: LoginInfo
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/account/login';

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }

    queryParameters = {};


    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 用户登录
* @method
* @name account#login
     * @param {} loginInfo - 登录信息
*/
login(parameters: {
'loginInfo'?: LoginInfo
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/account/login';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';





        if(parameters['loginInfo'] !== undefined) {
            body = parameters['loginInfo'];
        }




if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}

            form = queryParameters;
            queryParameters = {};

    this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

getUserInfoURL(parameters: {
'token': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/account/info';
                    if(parameters['token'] !== undefined){
                    queryParameters['token'] = parameters['token'];
                    }

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }



    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 获取当前用户信息
* @method
* @name account#getUserInfo
     * @param {string} token - This is a ProIn data access WebApi
*/
getUserInfo(parameters: {
'token': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/account/info';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';


                if(parameters['token'] !== undefined) {
                    queryParameters['token'] = parameters['token'];
                }





        if(parameters['token'] === undefined) {
            reject(new Error('Missing required  parameter: token'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}


    this.request('GET', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

logoutURL(parameters: {
'token': string
,
$queryParameters?: any, 
$domain?: string
}): string {
    let queryParameters: any = {};
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/account/logout';
                    if(parameters['token'] !== undefined){
                    queryParameters['token'] = parameters['token'];
                    }

    
    if(parameters.$queryParameters) {
        Object.keys(parameters.$queryParameters).forEach(function(parameterName) {
            queryParameters[parameterName] = parameters.$queryParameters[parameterName];
        });
    }

    queryParameters = {};


    let keys = Object.keys(queryParameters);
    return domain + path + (keys.length > 0 ? '?' + (keys.map(key => key + '=' + encodeURIComponent(queryParameters[key])).join('&')): '');
}

/**
* 用户注销
* @method
* @name account#logout
     * @param {string} token - This is a ProIn data access WebApi
*/
logout(parameters: {
'token': string
,
    $queryParameters?: any,
    $domain?: string
}): Promise<request.Response> {
    const domain = parameters.$domain ? parameters.$domain : this.domain;
    let path = '/account/logout';
    let body: any;
    let queryParameters: any = {};
    let headers: any = {};
    let form: any = {};
    return new Promise((resolve, reject) => {
    headers['Accept'] = 'application/json';
    headers['Content-Type'] = 'application/json,multipart/form-data';


                if(parameters['token'] !== undefined) {
                    queryParameters['token'] = parameters['token'];
                }





        if(parameters['token'] === undefined) {
            reject(new Error('Missing required  parameter: token'));
            return;
        }


if(parameters.$queryParameters) {
    Object.keys(parameters.$queryParameters).forEach(function(parameterName){
        queryParameters[parameterName] = parameters.$queryParameters[parameterName];
    });
}

            form = queryParameters;
            queryParameters = {};

    this.request('POST', domain + path, body, headers, queryParameters, form, reject, resolve);
    });
}

}
