'use strict';

var colors = require('colors');
var rotate = ['red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white', 'gray', 'red', 'green', 'blue', 'yellow', 'magenta', 'cyan', 'white', 'gray'];

var ran = module.exports.ran = function (max, padding) {
  padding = padding || 0;
  return Math.floor(Math.random() * max) + padding;
}

var color = module.exports.color = function (msg) {
  return msg[rotate[ran(16)]];
}

var color2 = module.exports.color2 = function (color) {
  return rotate[color];
}