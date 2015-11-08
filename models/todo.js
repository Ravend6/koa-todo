'use strict';

var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var schema = new Schema({
  title: {
    type: String,
    required: "Поле `{PATH}` должно быть заполнено.",
    minlength: [3, "Минимальная длина `{PATH}` должна быть {MINLENGTH} символов."]
  },
  done: Boolean,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date
  },
  userId: {
    type: Schema.Types.ObjectId, ref: 'User'
  }
  // roles: {
  //   type: [{
  //     type: String,
  //     enum: ['member', 'admin']
  //   }],
  //   default: ['member'],
  //   required: 'Пожалуйста, выбирите роль пользователя.',
  // },
  // posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

schema.methods.toJSON = function () {
  var todo = this.toObject();
  if (todo.updatedAt) {
    delete todo.done;
  }
  return todo;
};

schema.statics.toJSON = function (todoArray) {
  var result = [];
  for (let todo of todoArray) {
    if (todo.updatedAt) {
      delete todo.done;
    }
    result.push(todo);
  }
  return result;
};


module.exports = mongoose.model('Todo', schema);