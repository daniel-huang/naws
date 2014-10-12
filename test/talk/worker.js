'use strict';

var 
  zmq  = require('zmq'),
  pull = zmq.socket('pull'),
  pub  = zmq.socket('pub'),
  
  PULL = 'tcp://127.0.0.1:13371',
  PUB  = 'tcp://127.0.0.1:13372'
;

function handlePull(msg) {
  var parsed;

  msg = msg.toString();

  // parse this because we need the ID
  try {
    parsed = JSON.parse(msg);
  } catch (err) {
    // ouch. Ignore this, the request will timeout on the server side.
    console.log(err);
    return;
  }

  // echo back to the server with this worker's ID
  pub.send([parsed.id, msg].join(' '));
};

pull.on('message', handlePull);

process.nextTick(function () {
  pull.connect(PULL);
  pub.connect(PUB);

  pull.monitor();
  pull.on('connect', function () {
    console.log('Connected to server!');
  });

  pull.on('connect_retry', function () {
    console.log('Retrying connection to server...');
  });
});