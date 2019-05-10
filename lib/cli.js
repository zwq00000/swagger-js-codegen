'use strict';

const _ = require('lodash');
const axios = require('axios');
const { URL } = require('url');
const fs = require('fs');
const YAML = require('yamljs');
const pkg = require('../package.json');
const cli = require('commander');
const CodeGen = require('./codegen').CodeGen;
//文件名解析
const extreg = /\.(\w+)$/;

function loadSwaggerFile(path) {
    if (!fs.existsSync(fileUrl)) {
        throw new Error(`file ${fileUrl} not exists`);
    }


    if (extreg.test(path)) {
        let ext = path.match(extreg)[0].toLowerCase();
        switch (ext) {
            case '.json':
                return new Promise((resolve, reject) => {
                    try {
                        let data = JSON.parse(fs.readFileSync(fileUrl, 'utf-8'));
                        resolve(data);
                    } catch (err) {
                        reject(err);
                    }
                });
            case '.yaml':
            case '.yml':
                return new Promise((resolve, reject) => {
                    let data = YAML.load(path);
                    resolve(data);
                });
            default:
                throw new Error('not support file format');
        }
    }
}

function loadSwaggerUrl(url) {
    let path = url.pathname;
    if (extreg.test(path)) {
        let ext = path.match(extreg)[0].toLowerCase();
        switch (ext) {
            case '.json':
                return new Promise((resolve, reject) => {
                    axios.get(url.href)
                        .then(res => { resolve(res.data); })
                        .catch(err => reject(err));
                });
            //return JSON.parse(fs.readFileSync(fileUrl, 'utf-8'));
            case '.yaml':
            case '.yml':
                return new Promise((resolve, reject) => {
                    axios.get(url.href)
                        .then(res => { resolve(YAML.parse(res.data)); })
                        .catch(err => reject(err));
                });
            default:
                throw new Error('not support file format');
        }
    }
}

function loadSwagger(path) {
    console.log('load swagger file ' + path);
    let fileUrl = new URL(path);
    let protocol = fileUrl.protocol;

    console.log("protocol " + protocol);
    switch (protocol) {
        case 'file:':
            return loadSwaggerFile(path);
        case 'http:':
        case 'https:':
            return loadSwaggerUrl(fileUrl);
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
    path = path.replace('[','_');
    path = path.replace(']','');
    console.log('write source file ' + path);
    fs.writeFileSync(path, item.source, "utf-8");
};

//out put generate result to files
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
    .option('-t, --template <template>', 'template name default axios')
    .option('-o, --outputPath <path>', 'generated code output file path')
    .option('-l, --list', 'list buildin template name')
    .option('-v, --view', 'view swagger source')
    .command('generate <file>', 'Generate from Swagger file')
    .action((file) => {
        console.log(`load swagger file ` + file);
        let template = cli.template ? cli.template : 'axios';
        loadSwagger(file).then(data => {
            if (cli.view) {
                // console.log(JSON.stringify(data, null, 4), 'utf-8');
            }
            let options = {
                moduleName: 'default',
                swagger: data,
                lint: false
            };

            if (cli.outputPath) {
                outputSource({
                    name: 'swagger',
                    fileName: `swagger.json`,
                    source: JSON.stringify(data, null, 4)
                });

                outputSource(CodeGen.generate(options, template));

            } else {
                console.log(CodeGen.genCode(options, template));
            }

        }).catch(err => {
            console.log(err);
        });
    })
    .parse(process.argv);
if (cli.list) {
    return listTemplate();
}
if (!cli.args.length) {
    cli.help();
}