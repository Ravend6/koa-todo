'use strict';

var fs = require('fs');
var _ = require('lodash');
var Router = require('koa-router');
var router = new Router();
// var router = new Router({
//   prefix: '/todos'
// });
var config = require('../config.js');
var setNotify = require('../lib/helpers/notify');
var Todo = require('../models/todo');
var policy = require('../middleware/policy');

router.get('index', '/todos', policy.isAllowed(), function * (next) {

  let page = parseInt(this.query.page) || 1;
  let limit = parseInt(this.query.limit) || 5;
  let skip = page > 0 ? ((page - 1) * limit) : 0;
  var todos = yield Todo
    .find()
    .sort('-createdAt')
    .limit(limit)
    .skip(skip)
    .populate('userId', 'displayName')
    .execQ();

  let alltodos = yield Todo
    .find();
  let total = alltodos.length;
  yield this.render('todos/index', {
    todos,
    pagination: {
      total,
      limit,
      skip,
      page
    }
  });
});

router.get('new', '/todos/new', policy.isAllowed(), function * (next) {
  yield this.render('todos/new');
});

router.post('/todos/new', policy.isAllowed(), function * (next) {
  var form = this.request.body;
  var todo = new Todo({
    title: form.title,
    done: form.done || false,
    userId: this.req.user.id
  });

  try {
    yield todo.saveQ();
    // this.io.todos.emit('new', { todo });
    // this.flash = setNotify('success', 'Новая запись успешно создана.');
    this.setFlash('success', 'Новая запись успешно создана.');
    this.redirect(router.url('show', todo.id));
  } catch (e) {
    this.flash = setNotify('danger', 'Ошибка валидации.');
    this.redirect(router.url('new'));
  }
});

router.get('show', '/todos/:id', policy.isAllowed(), function * (next) {
  yield this.render('todos/show', {
    todo: this.todo
  });
});

router.get('edit', '/todos/:id/edit', policy.isAllowed(), policy.accessTodoById(), function * (next) {
  yield this.render('todos/edit', {
    todo: this.todo
  });
});

router.put('/todos/:id/edit', policy.isAllowed(), policy.accessTodoById(), function * (next) {
  try {
    this.todo.title = this.request.body.title;
    this.todo.done = this.request.body.done || false;
    this.todo.updatedAt = Date.now();

    yield this.todo.saveQ();
    this.flash = setNotify('success', 'Запись успешно обновлена.');
    this.redirect(router.url('index'));
  } catch (e) {
    this.flash = setNotify('danger', 'Ошибка валидации.');
    this.redirect(router.url('edit', this.todo.id));
  }

});

router.delete('delete', '/todos/:id', policy.isAllowed(), policy.accessTodoById(), function * (next) {
  try {
    yield this.todo.removeQ();
    this.flash = setNotify('success', 'Запись успешно удалена.');
    this.redirect(router.url('index'));
  } catch (e) {
    return this.throw(500);
  }
});

router.get('json', '/todos/:id/json', function * (next) {
  this.body = this.todo.toJSON();
});

router.get('json', '/todos/json', function * (next) {
  var todos = yield Todo.find().execQ();
  this.body = Todo.toJSON(todos);
});

router.param('id', function * (id, next) {
  try {
    var todo = yield Todo.findByIdQ(id);
    this.todo = todo;
  } catch (e) {
    return this.throw(404);
  }
  yield next;
});

module.exports = router;