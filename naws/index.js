'use strict';

var
  zmq  = require('zmq'),
  pull = zmq.socket('pull'),
  push = zmq.socket('push'),
  pub  = zmq.socket('pub'),
  sub  = zmq.socket('sub')
;

push.bindSync('tcp://*:13370');
pull.connect('tcp://*:13370');

sub.bindSync('tcp://*:13371');
sub.subscribe('rep');
pub.connect();

pull.on('message', function (msg) {
  msg = msg.toString();

  console.log(msg);

  pub.send('rep ' + msg);
});

sub.on('message', function (msg) {
  msg = msg.toString();

  console.log(msg);
});

setTimeout(function () {
  push.send('hello world');
}, 1000);