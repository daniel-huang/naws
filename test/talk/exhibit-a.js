/**
 * This is the demonstration of how REQ-REP in 0MQ is a synchronous lock-step
 * operation despite the API using async semantics. Here's how it works:
 *
 * 1. The server sends a random number, colourised so it's easy to track on the
 *    console. You should see "-" as a prefix at this stage.
 *
 * 2. Worker receives the payload, and immediately logs "--" as a prefix.
 *
 * 3. Worker performs a CPU heavy work, which essentially blocks the socket. In
 *    this example we use a binary tree alloc/dealloc algorithm.
 *    (http://benchmarksgame.alioth.debian.org/u64/program.php?test=binarytrees&lang=v8&id=1)
 *
 * 4. Once the block is completed, worker sends back the payload verbatim,
 *    while logging the prefix "---"
 *
 * 5. The server receives the payload, prints it with a prefix "----".
 *
 * You should be able to see how the server itself blocks on sending messages
 * until the worker returns with a reply.
 *
 * And this is why you never use REQ-REP by itself, but instead combine it with
 * ROUTER-DEALER, or better still, use PUSH-PULL + PUB/SUB instead.
 */
'use strict';

var zmq   = require('zmq');
var req   = zmq.socket('req');
var res   = zmq.socket('rep');
var crypt = require('crypto');

var work  = require('./binarytree');
var ran   = require('./random').ran;
var color = require('./random').color;

// Bind the REP socket
res.bindSync('inproc://exhibit-a');
console.log('- RES bound to "inproc://exhibit-a"');

// Make the REQ socket connect to the REP socket
req.connect('inproc://exhibit-a');
console.log('- REQ connected to "inproc://exhibit-a"');

req.on('message', function (msg) {
  console.log('---- recv: ' + msg.toString());
});

res.on('message', function (msg) {
  console.log('-- recv: ' + msg.toString());

  work();
  res.send(msg);
  console.log('--- send: ' + msg.toString());
});

setInterval(function () {
  
  var msg = color(ran(1000, 1000) + '');

  console.log('- send: ' + msg);
  req.send(msg);
}, 1000);
