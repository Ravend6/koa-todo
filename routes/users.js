'use strict';

var fs = require('fs');
var _ = require('lodash');
var Router = require('koa-router');
var router = new Router();
var app = require('../app.js');
var config = require('../config.js');
var setNotify = require('../lib/helpers/notify');


var users = [{
  id: 1,
  username: 'root',
  password: 'qwerty'
}, {
  id: 2,
  username: 'vova',
  password: 'qwerty'
}, {
  id: 3,
  username: 'test',
  password: 'qwerty'
}];

var nextId = users.length + 1;

router
  .get('index', '/users', function * (next) {
    // this.io.users.emit('new', 'root');
    // console.log(this.query);
    yield this.render('users/index', {
      users: users,
      flash: this.flash
    });
  })
  .get('show', '/users/:id', function * (next) {
    // var userIndex = _.findIndex(users, (user) => { return user.id == this.params.id});
    // var user = users[userIndex];
    var user = _.find(users, {
      id: Number(this.params.id)
    });

    yield this.render('users/show', {
      user,
      flash: this.flash
    });
  })
  .get('edit', '/users/:id/edit', function * (next) {
    let user = _.find(users, {
      id: Number(this.params.id)
    });
    yield this.render('users/edit', {
      user
    });
  })
  .put('edit', '/users/:id/edit', function * (next) {
    let userById = _.find(users, {
      id: Number(this.params.id)
    });
    let user = _.assign(userById, this.request.body);
    this.redirect(router.url('show', this.params.id));
  })
  .get('new', '/users/new', function * (next) {
    var user = _.find(users, {
      id: Number(this.params.id)
    });
    yield this.render('users/new', {flash: this.flash});
  })
  .post('/users/new', function * (next) {

    if (this.request.body.username === '') {
      this.flash = setNotify('danger', 'Ошибка валидации.');
      return this.redirect(router.url('new'));
    }
    users.push(_.assign(this.request.body, {
      id: nextId
    }));
    // console.log(this.request.method);
    // console.log('BODY---', this.request.body);
    // console.log('FILES---', this.request.body.files);

    // if (this.request.body.files) {
    //   let thumbnail = this.request.body.files.thumbnail;
    //   let dir = config.uploadPostThumbnailDir +
    //     '\\' + 10;
    //   if (!fs.existsSync(dir)) {
    //     fs.mkdirSync(dir);
    //   }
    //   fs.renameSync(thumbnail.path, dir +
    //     '\\' + thumbnail.name);
    // }

    // this.status = 201;
    // this.body = this.request.body;
    this.flash = setNotify('success', 'Новый пользователь успешно создан.');
    this.redirect(router.url('show', nextId));
    nextId++;
  })
  .del('delete', '/users/:id', function * (next) {
    // let userIndex = _.findIndex(users, {
    //   id: Number(this.params.id)
    // });
    users.splice(this.userIndex, 1);
    this.flash = setNotify('success', 'Пользователь успешно удален.');
    this.redirect(router.url('index'));
  });

router.param('id', function * (id, next) {
  this.userIndex = _.findIndex(users, {
    id: Number(id)
  });
  if (this.userIndex === -1) {
    return this.throw(404);
  }
  yield next;
});

// module.exports = router.middleware();
module.exports = router;