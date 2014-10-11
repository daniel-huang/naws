'use strict';

var 
  zmq     = require('zmq'),
  push    = zmq.socket('push'),
  sub     = zmq.socket('sub'),
  
  http    = require('http'),
  crypt   = require('crypto'),
  Event   = require('events').EventEmitter,
  queue   = new Event(),
  
  cache   = {},
  workers = 0
;

//-----------------------------------------------------------------------------
// Constants
//-----------------------------------------------------------------------------
var 
  PORT       = 13370,
  PUSH       = 'tcp://127.0.0.1:13371', 
  SUB        = 'tcp://127.0.0.1:13372',
  BASE_FLOOD = 100,
  TIMEOUT    = 10000
;

//-----------------------------------------------------------------------------
// Utility functions section
//-----------------------------------------------------------------------------
function signJob(body) {
  var sha1 = crypt.createHash('sha1')
  sha1.update(body);

  return sha1.digest('base64');
}

//-----------------------------------------------------------------------------
// Socket bindings and global events
//-----------------------------------------------------------------------------
push.bind(PUSH, function () {
  console.log('PUSH socket connected on port: ' + PUSH);
});

push.on('bind', function () {
  // Allows PUSH to detect if a worker leaves
  push.monitor();
});

sub.bind(SUB, function () {
  console.log('SUB socket connected on port: ' + SUB);
});

sub.on('bind', function () {
  // Allows SUB to detect if a worker leaves
  sub.monitor();
});

sub.on('disconnect', function (ev, addr) {
  console.log('A worker disconnected, total: ' + --workers);
});

sub.on('accept', function () {
  console.log('A worker connected, total: ' + ++workers);
});

//-----------------------------------------------------------------------------
// SUB now acts as a message receiver. Upon receiving a message, it saves it to
// a cache with a TTL, with the jobId as a key.
//-----------------------------------------------------------------------------
sub.on('message', function (msg) {
  var 
    msg = msg.toString(),
    pay = msg.split(' '),
    id  = pay.shift()
  ;

  cache[id] = pay;

  sub.unsubscribe(id);
});

//-----------------------------------------------------------------------------
// Start the HTTP server
//-----------------------------------------------------------------------------
http.createServer(function (req, res) {
  var 
    method        = req.method,
    url           = req.url,
    id            = signJob(method + ' ' + url),
    interval      = null,
    FLOOD_CONTROL = BASE_FLOOD
  ;

  // Subscribe to the jobID
  sub.subscribe(id);

  // Push out to workers only if there are workers
  if (!workers) {
    res.end('No workers available!');
    return;
  }

  push.send(JSON.stringify({
    id     : id,
    method : method,
    url    : url
  }));

  // We use a polling mechanism here to check if there is a value in the cache
  // matching the job ID. This is NOT efficient, but it does work well for high
  // thoroughput situations. If you need speed, rewrite this into an emitter
  // instead.
  interval = setInterval(function () {
    if (cache[id]) {
      clearInterval(interval);
      res.statusCode = 200;
      res.end(cache[id] + '');
      return;
    }
  }, FLOOD_CONTROL);

  // Set a timeout here so we don't wait forever
  setTimeout(function () {
    clearInterval(interval);
    res.statusCode = 500;
    res.end('No response received from any workers!');
  }, TIMEOUT);

}).listen(PORT, function () {

  console.log('HTTP server listening on port ' + PORT);
});