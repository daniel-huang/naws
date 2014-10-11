'use strict';

var zmq  = require('zmq');
var pull = zmq.socket('pull');
var pub  = zmq.socket('pub');

function handlePull(msg) {
  var parsed;

  msg = msg.toString();

  // parse this because we need the ID
  try {
    console.log(msg);
    parsed = JSON.parse(msg);
  } catch (err) {
    // ouch
    console.log(err);
    return;
  }

  // echo back to the server with this worker's ID
  pub.send([parsed.id, msg].join(' '));
};

pull.on('message', handlePull);

process.nextTick(function () {
  pull.connect('tcp://127.0.0.1:13371');
  pub.connect('tcp://127.0.0.1:13372');

  pull.monitor();
  pull.on('connect', function () {
    console.log('Connected to server!');
  });

  pull.on('connect_retry', function () {
    console.log('Retrying connection to server...');
  });
});