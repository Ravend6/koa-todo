'use strict';

var acl = require('../lib/acl');

exports.isAllowed = function () {
  return function * (next) {
    var params = this.params;
    if (params.id === 'new') {
      params = {};
    }
    acl.normalizeParams(params);
    var method = this.request.method.toLowerCase();
    var roles = (this.req.user) ? this.req.user.roles : ['guest'];
    var url = this.request.path;
    if (acl.checkAccess(url, method, roles)) {
      yield next;
    } else {
      if (this.request.xhr) {
        this.status = 403;
        return this.body = {
          error: 'У вас нет прав доступа.'
        };
      }
      yield this.throw(403, 'У вас нет прав доступа.');
    }
  };
};

exports.accessTodoById = function () {
  return function * (next) {
    if (JSON.stringify(this.todo.userId) === JSON.stringify(this.req.user.id)) {
      return yield next;
    }
    this.throw(403, 'У вас нет прав.');
  };
};