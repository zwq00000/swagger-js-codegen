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
        render(text);
        var tockens = parseTocken(text);
        var list = _.map(this[tockens[0]],tockens[1]);
        return list.join(',');
    };
};

const assignInternalFuncs = function (data) {
    data.lower = lower;
    data.join = join;
};

module.exports = assignInternalFuncs;