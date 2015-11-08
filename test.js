'use strict';

var app = require('./app.js');
var request = require('supertest').agent(app.listen());

describe('Simple user crud api', function () {
  var user = {name: 'root'};
  it('add new user', function (done) {
    request
      .post('/user')
      .send(user)
      // .expect('Location', /^\/user\/[0-9a-fA-F]{24}$/)
      .expect('Location', '/user/' + 1000)
      .expect(201, done);
  });
});

