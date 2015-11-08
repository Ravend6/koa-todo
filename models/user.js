'use strict';

var mongoose = require('mongoose');
var crypto = require('crypto');
var config = require('../config');
var jwt = require('jwt-simple');

var Schema = mongoose.Schema;

var schema = new Schema({
  displayName: String,
  token: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  local: {
    email: {
      type: String,
      // required: "Поле `{PATH}` должно быть заполнено.",
      // unique: "Этот `{PATH}` уже занят."
    },
    password: {
      type: String,
      // select: false
      // required: "Поле `{PATH}` должно быть заполнено.",
      // minlength: [6, "Минимальная длина пароля должна быть {MINLENGTH} символов."]
    }
  },
  facebook: {
    id: String,
    token: String,
    email: String
  },
  vkontakte: {
    id: String,
    token: String,
    email: String
  },
  google: {
    id: String,
    token: String,
    email: String
  },
  steam: {
    id: String,
    openId: String,
  },
  roles: {
    type: [{
      type: String,
      enum: ['member', 'admin']
    }],
    default: ['member'],
    required: 'Пожалуйста, выбирите роль пользователя.',
  },
  // posts : [{ type: Schema.Types.ObjectId, ref: 'Post' }]
});

schema.methods.toJSON = function () {
  var user = this.toObject();
  if (user.local) {
    delete user.local.password;
  }
  return user;
};

schema.statics.toJSON = function (usersArray) {
  var result = [];
  for (let user of usersArray) {
    if (user.local) {
      delete user.local.password;
    }
    result.push(user);
  }
  return result;
};

schema.statics.createToken = function (req, userId) {
  return jwt.encode({
    iss: req.hostname,
    sub: userId
  }, config.secret);
};

schema.methods.hashPassword = function (password) {
  return encryptPassword(password);
};

schema.methods.verifyPassword = function (password) {
  return this.local.password === encryptPassword(password);
};

function encryptPassword(password) {
  let hmac = crypto.createHmac('sha1', config.secret);
  return hmac.update(password).digest('hex');
}

module.exports = mongoose.model('User', schema);