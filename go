#!/usr/bin/env node
'use strict';

var argv = require('minimist')(process.argv.slice(2));
// console.dir(argv);

if (argv.seed) {
  var seed = require('./lib/db/seed');
  seed.todos(argv.seed === true ? 1 : argv.seed);
}