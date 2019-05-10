'use strict';

const _ = require('lodash');

const parseTocken = function(text){
    text = text.replace('{{','');
    text = text.replace('}}','');
    return _.split(text,'.');
};

const lower = function () {
    return function (text, render) {
        return render(text).toLowerCase();
    };
};

const join = function () {
    return function (text, render) {
        let result = render(text);
        return result.substring(0,result.lastIndexOf(','))
    };
};

const assignInternalFuncs = function (data) {
    data.lower = lower;
    data.join = join;
};

module.exports = assignInternalFuncs;