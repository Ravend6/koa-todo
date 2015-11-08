'use strict';

var Router = require('koa-router');
var router = new Router();
var authMdw = require('../middleware/auth');
var co = require('co');
var User = require('../models/user');
var policy = require('../middleware/policy');

router.get('index', '/', function * (next) {
  yield this.render('index');
});

router.get('profile', '/profile', authMdw.loggedIn(), function * (next) {
  yield this.render('profile', {
    user: this.req.user
  });
});

router.get('bob', '/bob', policy.isAllowed(), function * (next) {

  // var user = yield co(function * () {

  //   return yield User.findOne({
  //     displayName: 'bob@email.com'
  //   }).exec();


  // });
  var users = yield co(function * () {

    var usr1 = yield User.findOne({
      displayName: 'bob@email.com'
    }).exec();

    var usr2 = yield User.findOne({
      displayName: 'test@email.com'
    }).exec();

    return yield [usr1, usr2];
  });

  yield this.render('bob', {
    user: users[0]
  });

});

module.exports = router;

