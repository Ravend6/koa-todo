'use strict';

var faker = require('faker');
var chalk = require('chalk');
var dbConnect = require('./connect')();
var Todo = require('../../models/todo');

function todos(count) {
  console.log(chalk.cyan.bold(`Start todos seed...`));
  for (let i = 0; i < count; i++) {
    let todo = new Todo({
      title: '#' + i + ' ' + faker.name.title(),
      done: faker.random.boolean(),
      createdAt: faker.date.past()
    });
    todo.save();
  }
  console.log(chalk.cyan.bold(`Success seed with count ${count}`));
  dbConnect.close();
}

module.exports = {
  todos
};