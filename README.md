# NAWS - Not Another Web Server

## Installation

    npm install naws

## Use

When using NAWS, you should only concern yourself with writing the worker, where the majority of the business code lies. Workers should be able to fail fast and restart fast. Due to the nature of zeromq, doing so has minimal costs.

    var naws = require('naws');

    var worker = naws();

    worker.set('socket.in', 'tcp://*:13370');
    worker.set('socket.out', 'tcp://*:13371');

    worker.task('index', function (req, res) {
      res.send('Hello World');
    });

    worker.connect();