'use strict';

module.exports = function * (next) {
  this.request.xhr = this.request.headers['x-requested-with'] === 'XMLHttpRequest';
  yield next;
};