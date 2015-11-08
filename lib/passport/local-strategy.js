'use strict';

var passport = require('koa-passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../../models/user');
var config = require('../../config');
var setNotify = require('../helpers/notify');
var validator = require('../helpers/validator');

var register = function (req, email, password, cb) {

  User.findOne({ 'local.email': email }, function (err, data) {
    if (err) {
      cb(err);
    }
    if (data) {
      req.flash = setNotify('warning', 'Такой email уже используется.');
      return cb(null, false);
    }
    var user;
    if (req.user) {
      user = req.user; // NOTICE: maybe remove
    } else {
      user = new User();
      user.displayName = email;
      user.token = User.createToken(req, user._id);
    }
    if (!validator.email(email)) {
      req.flash = setNotify('danger', 'Введите валидный email.');
      return cb(err);
    }
    if (password.length < 4) {
      req.flash = setNotify('danger', 'Минимальная длина пароля должна быть 4 символа.');
      return cb(err);
    }
    user.local.email = email;
    user.local.password = user.hashPassword(password);
    user.save(function (err) {
      if (err) {
        throw err;
      }
      req.flash = setNotify('success', 'Вы успешно зарегистрировались.');
      return cb(null, user);
    });

  });
};

var login = function (req, email, password, cb) {
  User.findOne({ 'local.email': email }, function (err, user) {
    if (err) {
      cb(err);
    }
    if (!user || !user.verifyPassword(password)) {
      req.flash = setNotify('danger', 'Неверный логин или пароль.');
      return cb(null, false);
    }
    req.flash = setNotify('success', 'Вы успешно вошли.');
    return cb(null, user);
  });
};

passport.use('local-register', new LocalStrategy(config.local, register));
passport.use('local-login', new LocalStrategy(config.local, login));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = {
  register: passport.authenticate('local-register', {
    successRedirect: '/',
    failureRedirect: '/register'
  }),
  connect: passport.authenticate('local-register', {
    successRedirect: '/profile',
    failureRedirect: '/auth/connect/local'
  }),
  login: passport.authenticate('local-login', {
    successRedirect: '/',
    failureRedirect: '/login'
  }),
  disconnect: function (req, res, next) {

      var user = req.user;
      user.local = undefined;
      // user.local.email = undefined;
      // user.local.password = undefined;
      user.save(function (err, data) {
        if (err) {
          throw err;
        }
        if (!data.local.email && !data.facebook.id) {
          data.remove(function (err, deletedUser) {
            if (err) {
              throw err;
            }
            req.session.destroy();
          });
        }
      });
      next();
  }
};

