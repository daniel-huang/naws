/**
 *
 * - send: 1210 -----------
 * - send: 1723 ----------|----
 * - send: 1513 ----------|---|----
 * ---- recv: 1723 <------|----   
 * - send: 1164 ----------|------------
 * - send: 1146 ----------|----------------
 * - send: 1926 ----------|--------------------
 * ---- recv: 1164        |
 * - send: 1841 ----------|------------------------
 * ---- recv: 1513        |
 * - send: 1844 ----------|----------------------------
 * - send: 1430 ----------|--------------------------------
 * ---- recv: 1210 <-------
 * ---- recv: 1926
 * ---- recv: 1841
 * ---- recv: 1146
 * ---- recv: 1430
 * ---- recv: 1844
 */
'use strict';

var zmq   = require('zmq');
var ran   = require('./random').ran;
var color = require('./random').color2;
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
    setTimeout(function () {
      msg = msg.toString();
      console.log('---- recv: ' + msg[color(code)]);
    }, ran(5000, 500));
  }
}

push.bind(ADDR);
var intHandler = setInterval(function () {
  var msg = ran(1000, 1000) + '';
  console.log('- send: ' + msg);
  push.send(msg);
}, 500);

setTimeout(function () {
  clearInterval(intHandler);
}, 5000);