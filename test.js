var fs = require('fs');
var CodeGen = require('./lib/codegen.js').CodeGen;

var list = fs.readdirSync('tests/apis');
list.forEach(function (file) {
    file = 'tests/apis/' + file;
    console.log('open api file ' + file)
    var swagger = JSON.parse(fs.readFileSync(file, 'UTF-8'));
    var result = CodeGen.getAxiosCode({
        swagger: swagger,
        lint: false
    });
    console.log(result)
});

