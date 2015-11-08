'use strict';

var Router = require('koa-router');
var router = new Router();
var passport = require('koa-passport');
var localStrategy = require('../lib/passport/local-strategy');
var facebookStrategy = require('../lib/passport/facebook-strategy');
var vkontakteStrategy = require('../lib/passport/vkontakte-strategy');
var steamStrategy = require('../lib/passport/steam-strategy');
var googleStrategy = require('../lib/passport/google-strategy');
var config = require('../config');
var authMdw = require('../middleware/auth');


router.get('login', '/login', function * (next) {
  yield this.render('auth/login');
});

router.post('/login', function * (next) {
  if (this.request.body.rememberMe) {
    this.session.maxAge = config.cookieMaxAge;
  }
  yield next;
}, localStrategy.login);

router.get('logout', '/logout', authMdw.loggedIn(), function * (next) {
  this.logout();
  this.session = null;
  this.redirect('/');
});


// Local
router.get('register', '/register', function * (next) {
  if (this.isAuthenticated()) {
    this.setFlash('info', 'Регистрация доступная только для гостей.');
    return this.redirect('/');
  }
  yield next;
}, function * (next) {
  yield this.render('auth/register');
});

router.post('/register', authMdw.guestIn(), localStrategy.register);

// Facebook
router.get('facebook', '/auth/facebook', authMdw.guestIn(), facebookStrategy.login);
router.get('/auth/facebook/callback', authMdw.guestIn(), function * (next) {
  this.session.maxAge = config.cookieMaxAge;
  yield next;
}, facebookStrategy.callback);

// Vkontakte
router.get('vkontakte', '/auth/vkontakte', authMdw.guestIn(), vkontakteStrategy.login);
router.get('/auth/vkontakte/callback', authMdw.guestIn(), function * (next) {
  this.session.maxAge = config.cookieMaxAge;
  yield next;
}, vkontakteStrategy.callback);

// Google
router.get('google', '/auth/google', authMdw.guestIn(), googleStrategy.login);
router.get('/auth/google/callback', authMdw.guestIn(), function * (next) {
  this.session.maxAge = config.cookieMaxAge;
  yield next;
}, googleStrategy.callback, function * (next) {
  this.redirect('/');
});

// Steam
router.get('steam', '/auth/steam', authMdw.guestIn(), steamStrategy.login);
router.get('/auth/steam/callback', authMdw.guestIn(), function * (next) {
  this.session.maxAge = config.cookieMaxAge;
  yield next;
}, steamStrategy.callback);


module.exports = router;
