'use strict';

var zmq   = require('zmq');
var ran   = require('./random').ran;
var color = require('./random').color2;

var ADDR  = 'tcp://127.0.0.1:13370';

var sub  = zmq.socket('sub');
var pub1 = zmq.socket('pub');
var pub2 = zmq.socket('pub');
var pub3 = zmq.socket('pub');

sub.bindSync(ADDR);
sub.subscribe('rep');
sub.on('message', handle);

pub1.connect(ADDR);
pub2.connect(ADDR);
pub3.connect(ADDR);

function handle(msg) {
  console.log(msg.toString());
}

setInterval(function () {
  pub1.send('rep ' + 'from pub 1'[color(1)]);
}, 250);

setInterval(function () {
  pub2.send('rep ' + 'from pub 2'[color(3)]);
  pub3.send('rep ' + 'from pub 3'[color(4)]);
}, 1000);
