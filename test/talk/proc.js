'use strict';

/**
 * Proc - a common library to spawn detached child processes
 */
var spawn = require('child_process').spawn;
var fs    =  require('fs');
var out   = fs.openSync('./out.log', 'a');


module.exports = make(file) {
  var child = spawn(__dirname + '/' + file, [], {
    cwd      : __dirname,
    detached : true,
    stdio    : ['ignore', out, out]
  });

  child.unref();

  // Write the PID into the pid folders with a random name
  var filename = Math.random() * (2000 - 1000) + 1000;
  fs.writeSync(__dirname + '/pid/' + filename + '.pid', child.pid, 'utf8');

  return child;
}