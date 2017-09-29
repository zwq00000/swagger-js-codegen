'use strict';

const _ = require('lodash');
const fs = require('fs');
const YAML = require('yamljs');
const pkg = require('../package.json');
const cli = require('commander');
const CodeGen = require('./codegen').CodeGen;

function loadJson(path) {
    if (!fs.existsSync(path)) {
        throw new Error(`file ${path} not exists`);
    }
    console.log('load swagger file ' + path);
    let extreg = /\.(\w+)$/;
    if (extreg.test(path)) {
        let ext = path.match(extreg)[0].toLowerCase();
        switch (ext) {
            case '.json':
                return JSON.parse(fs.readFileSync(path, 'utf-8'));
            case '.yaml':
            case '.yml':
                return YAML.load(path);
            default:
                throw new Error('not support file format');
        }
    }
}

const listTemplate = function () {
    const templatePath = './templates';
    var items = fs.readdirSync(templatePath);
    console.log("buildin templates:");
    items.forEach(function (element) {
        let stat = fs.statSync(`${templatePath}/${element}`);
        if (stat.isDirectory()) {
            console.log("  " + element);
        }
    }, this);
};

const saveFile = function (basePath, item) {
    let path = `${basePath}/${item.fileName}`;
    console.log('write source file ' + path);
    fs.writeFileSync(path, item.source, "utf-8");
}

const outputSource = function (items) {
    let basePath = cli.outputPath;
    if (basePath === '') {
        basePath = '.';
    } else if (!fs.existsSync(basePath)) {
        console.log('create folder ' + basePath);
        fs.mkdirSync(basePath);
    }
    if (_.isArray(items)) {
        _.forEach(items, item => {
            saveFile(basePath, item);
        });
    } else {
        saveFile(basePath, items);
    }
};

cli.version(pkg.version)
    .option('-t, --template <template>', 'template name default typescript')
    .option('-o, --outputPath <path>', 'generated code output file path')
    .option('-l, --list', 'list buildin template name')
    .command('generate <file>', 'Generate from Swagger file')
    .action((file) => {
        let template = cli.template ? cli.template : 'typescript';
        let options = {
            moduleName: 'default',
            swagger: loadJson(file),
            lint: false
        };
        if (cli.outputPath) {
            outputSource(CodeGen.generate(options, template));
        } else {
            let result = CodeGen.genCode(options, template);
            console.log(result);
        }
    })
    .parse(process.argv);
if (cli.list) {
    return listTemplate();
}
if (!cli.args.length) {
    cli.help();
}