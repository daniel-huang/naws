'use strict';

var zmq   = require('zmq');
var ran   = require('./random').ran;
var color = require('./random').color2;

var ADDR1 = 'inproc://exhibit-c-1';
var ADDR2 = 'inproc://exhibit-c-2';
var ADDR3 = 'inproc://exhibit-c-3';

var push1 = zmq.socket('push');
var push2 = zmq.socket('push');
var push3 = zmq.socket('push');

push1.bind(ADDR1);
push2.bind(ADDR2);
push3.bind(ADDR3);

var pull = zmq.socket('pull');

pull.connect(ADDR1);
pull.connect(ADDR2);
pull.connect(ADDR3);

pull.on('message', function (msg) {
  console.log('----' + msg.toString());
});

setInterval(function () {
  // console.log('sending test1');
  push1.send('test1'[color(1)]);
}, 500);

setInterval(function () {
  // console.log('sending test2');
  push2.send('test2'[color(4)]);

  // console.log('sending test3');
  push3.send('test3'[color(3)]);
}, 1000);