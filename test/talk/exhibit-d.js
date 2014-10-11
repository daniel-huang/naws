'use strict';

var zmq   = require('zmq');
var ran   = require('./random').ran;
var color = require('./random').color;

var ADDR  = 'tcp://127.0.0.1:13370';

var pub  = zmq.socket('pub');
var sub1 = zmq.socket('sub');
var sub2 = zmq.socket('sub');
var sub3 = zmq.socket('sub');

pub.bind(ADDR);

sub1.subscribe('rep');
sub1.connect(ADDR);
sub1.on('message', handle('sub1'));

sub2.subscribe('rep');
sub2.connect(ADDR);
sub2.on('message', handle('sub2'));

sub3.subscribe('rep');
sub3.connect(ADDR);
sub3.on('message', handle('sub3'));

function handle(id) {
  return function (msg) {
    console.log(id + ': ' + msg.toString());
  }
}

setInterval(function () {
  pub.send('rep ' + color('JSDC is awesome'));
}, 1000);

setTimeout(function () {
  console.log('sub3 says goodbye...');
  sub3.close();
}, 5000);

setTimeout(function () {
  console.log('sub3 rejoins...');
  sub3 = zmq.socket('sub');
  sub3.connect(ADDR);
  sub3.subscribe('rep');
  sub3.on('message', handle('sub3'));
}, 8000);