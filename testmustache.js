var Mustache = require('mustache');

const data = {
    list:[1,2,3,4,5,6]
}

const template = '{{#list}} {{.}} {{/list}}'
let options = {
    list: function () {
        return function(text,render){
            return '<b>' + render(text) +'</b>'
        }
    }
};

console.log(Mustache.render(template,data))

console.log(Mustache.render(template,options))