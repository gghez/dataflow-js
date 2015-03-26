var dataflowJs = require('../src/index');

Object.keys(dataflowJs).forEach(function (type) {
    global[type] = dataflowJs[type];
});

global.assert = require('chai').assert;
global.sinon = require('sinon');
global.Q = require('q');