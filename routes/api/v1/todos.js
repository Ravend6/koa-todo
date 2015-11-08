'use strict';

var fs = require('fs');
var _ = require('lodash');
var Router = require('koa-router');
var router = new Router({
  prefix: '/api/v1/todos'
});
var Todo = require('../../../models/todo');
var authMdw = require('../../../middleware/auth');

router.get('/', function * (next) {
  // console.log(this.request.path);
  let page = parseInt(this.query.page) || 1,
    limit = parseInt(this.query.limit) || 3,
    skip = page > 0 ? ((page - 1) * limit) : 0;

  let todos = yield Todo
    .find()
    // .sort('-createdAt')
    .limit(limit)
    .skip(skip)
    .execQ();

  this.body = todos;

  // let total = yield Todo
  //   .find()
  //   .execQ();
  // total = total.length;

  // this.body = {
  //   todos
  //   pagination: {
  //     page,
  //     limit,
  //     skip,
  //     total
  //   }
  // };
});
router.get('/token', authMdw.tokenAccess(), function * (next) {
  this.body = {
    data: this.tokenAuth
  };
});

module.exports = router.middleware();