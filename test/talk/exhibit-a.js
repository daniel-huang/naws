'use strict';

var zmq = require('zmq');
var req = zmq.socket('req');
var res = zmq.socket('rep');

res.bindSync('inproc://exhibit-a');
req.connect('inproc://exhibit-a');

req.on('message', function (msg) {
  console.log(msg.toString());
});

res.on('message', function (msg) {
  res.send(msg);
});

setInterval(function () {
  req.send('Hello World');
}, 1000);