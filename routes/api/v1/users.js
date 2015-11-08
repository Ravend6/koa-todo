'use strict';

var fs = require('fs');
var _ = require('lodash');
// var router = require('../../../lib/router');
var Router = require('koa-router');
var router = new Router();



var users = [{
  id: 1,
  username: 'root',
  password: 'qwerty'
}, {
  id: 2,
  username: 'vova',
  password: 'qwerty'
}, {
  id: 3,
  username: 'test',
  password: 'qwerty'
}];

router.del('/api/v1/users/:id', function * (next) {
  this.body = {
    err: null,
    id: this.params.id
  };
});

module.exports = router.middleware();