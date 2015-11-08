'use strict';

var jwt = require('jwt-simple');
var config = require('../config');

function loadAccess() {
  return function * (next) {
    this.state.isGuest = !this.isAuthenticated();
    this.state.isLogging = this.isAuthenticated();
    this.state.currentUser = this.req.user;
    yield next;
  };
}

function loggedIn() {
  return function * (next) {
    if (this.isAuthenticated()) {
      yield next;
    } else {
      this.setFlash('warning', 'Только для зарегистрированых пользователей.');
      this.redirect('/login');
    }
  };
}

function guestIn() {
  return function * (next) {
    if (!this.isAuthenticated()) {
      yield next;
    } else {
      this.setFlash('warning', 'Только для гостей.');
      this.redirect('/');
    }
  };
}

function initJWTtoken() {
  return function * (next) {
    if (this.req.user) {
      this.set('JWT-Token', this.req.user.token);
    }
    yield next;
  };
}

function tokenAccess() {
  return function * (next) {
    if (!this.request.headers.authorization) {
      return this.throw(401, "You are not authorized.");
    }
    var token = this.request.headers.authorization.split(' ')[1];
    try {
      var payload = jwt.decode(token, config.secret);
    } catch (error) {
      return this.throw(401, error.message);
    }
    if (!payload.sub) {
      return this.throw(401, 'Authentication failed.');
    }
    this.tokenAuth = {
      userId: payload.sub,
      token: token
    };
    yield next;
  };
}


module.exports = {
  loadAccess,
  loggedIn,
  initJWTtoken,
  tokenAccess,
  guestIn,
};