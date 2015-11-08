'use strict';

var acl = require('../lib/acl');

module.exports = function () {
  acl.allow([
    {
      roles: ['admin'],
      allows: [
        {
          resources: ['/todos', '/todos/new', '/todos/:id', '/todos/:id/edit'],
          permissions: ['*']
        }
      ]
    },
    {
      roles: ['member'],
      allows: [
        {
          resources: ['/todos', '/todos/new', '/todos/:id', '/todos/:id/edit'],
          permissions: ['get', 'post', 'put', 'delete']
        }
      ]
    },
    {
      roles: ['guest'],
      allows: [
        {
          resources: ['/todos', '/todos/', '/todos/:id'],
          permissions: ['get']
        }
      ]
    }
  ]);
};