const fs = require('fs');
const _ = require('lodash');
const YAML = require('yamljs')
var CodeGen = require('./lib/codegen.js').CodeGen;
var swagger2 = require('./lib/swagger2View')

//var list = fs.readdirSync('tests/apis');
const proinapi = 'D:/Projects/PrimaN/ProIn Projects/Extensions/ProIn.WebApi/api/swagger.yaml'
file = proinapi;
console.log('open api file ' + file)
let json = YAML.load(proinapi)

var methods = _.filter(json.paths,(api,path)=>{
    //console.log(api);
    //console.log(path);
    if(api.get && api.get.tags){
        return api;
    }
});
//console.log(methods)

swagger2.swagger = json;

/*_.forEach(json.paths,(p,pname)=>{
    var path = swagger2.parsePath(p,pname);
    console.log(path);
})*/
let data = swagger2.getView({swagger:json},"axios");
console.log(data);

//return;

var swagger = json; //JSON.parse(fs.readFileSync(file, 'UTF-8'));
var result = CodeGen.generate({
    className: 'Test',
    swagger: swagger,
    lint: false
}, 'axios');
_.forEach(result,item=>{
    let path = `./tmp/${item.fileName}`;
    fs.writeFileSync(path,item.source,"utf-8")
});
