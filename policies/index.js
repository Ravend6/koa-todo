'use strict';

var acl = require('../lib/acl');

module.exports = function () {
  acl.allow([
    {
      roles: ['guest'],
      allows: [
        {
          resources: ['/', '/bob'],
          permissions: ['get']
        }
      ]
    },
    {
      roles: ['member', 'admin'],
      allows: [
        {
          resources: ['/bob'],
          permissions: ['get']
        }
      ]
    },
  ]);
};