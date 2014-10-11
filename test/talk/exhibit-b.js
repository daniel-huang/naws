'use strict';

var zmq   = require('zmq');
var ran   = require('./random').ran;
var color = require('./random').color2;
var work  = require('./binarytree');
//var ADDR  = 'tcp://127.0.0.1:13371';
var ADDR = 'inproc://exhibit-b';

var push  = zmq.socket('push');
var pull1 = zmq.socket('pull');
var pull2 = zmq.socket('pull');
var pull3 = zmq.socket('pull');

pull1.connect(ADDR);
pull2.connect(ADDR);
pull3.connect(ADDR);

pull1.on('message', handle(1));
pull2.on('message', handle(3));
pull3.on('message', handle(4));

function handle(code) {
  return function (msg) {
    process.nextTick(function () {
      msg = msg.toString();
      if (code === 4) work();
      console.log('---- recv: ' + msg[color(code)]);
    });
  }
}

push.bindSync(ADDR);
setInterval(function () {
  //var msg = color(ran(1000, 1000) + '');
  var msg = ran(1000, 1000) + '';

  console.log('- send: ' + msg);
  push.send(msg);
}, 500);