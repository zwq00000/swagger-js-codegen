var fs = require('fs');
const YAML = require('yamljs')
var CodeGen = require('./lib/codegen.js').CodeGen;

//var list = fs.readdirSync('tests/apis');
const proinapi = 'D:/Projects/PrimaN/ProIn Projects/Extensions/ProIn.WebApi/api/swagger.yaml'
    file = proinapi;
    console.log('open api file ' + file)
    let json = YAML.load(proinapi)
    var swagger = json; //JSON.parse(fs.readFileSync(file, 'UTF-8'));
    var result = CodeGen.getAxiosCode({
        className: 'Test',
        swagger: swagger,
        lint: false
    });
    console.log(result)
