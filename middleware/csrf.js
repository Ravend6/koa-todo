'use strict';

var Tokens = require('csrf');

var tokens = new Tokens();
var secret = tokens.secretSync();

module.exports = function * (next) {
  var token = tokens.create(secret);
  this.session.csrfToken = token;
  this.set('CSRF-Token', this.session.csrfToken);
  this.state.csrfToken = this.session.csrfToken;
  if (this.method === 'POST' || this.method === 'PUT' ||
    this.method === 'DELETE') {
    var csrf = this.request.body._csrf || this.request.body.fields._csrf ||
      this.response.header['csrf-token'];
    if (!tokens.verify(secret, csrf)) {
      // throw new Error('invalid token');
      this.throw('Invalid token', 400);
    }
  }
  yield next;
};