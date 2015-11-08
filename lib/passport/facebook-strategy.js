'use strict';

var _ = require('lodash');
var util = require('util');
var passport = require('koa-passport');
var FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/user');
var config = require('../../config');
var setNotify = require('../helpers/notify');
// var validator = require('../helpers/validator');

var init = function (req, token, refreshToken, profile, callback) {
  process.nextTick(function () {
    // req.user === undefined
    if (req.user) {
      User.findOne({ 'facebook.id': profile.id }, function (err, userExists) {
        if (err) {
          throw err;
        }
        if (userExists) {
          req.flash = setNotify('danger', 'Такой facebook аккаунт уже занят.');
          return callback(null, false);
        }
        var user = req.user;
        user.token = User.createToken(req, user._id);
        user.facebook.id = profile.id;
        user.facebook.token = token;
        // user.facebook.avatar = profile.photos[0].value;
        user.facebook.email = profile.emails[0].value;
        process.nextTick(function () {
          user.save(function (err) {
            if (err) {
              throw err;
            }
            req.flash = setNotify('success', 'Вы успешно вошли.');
            return callback(null, user);
          });
        });
      });
    } else {
      User.findOne({ 'facebook.id': profile.id }, function (err, data) {
        if (err) {
          return callback(err);
        }
        if (data) {
          return callback(null, data);
        }
        var user = new User();
        user.token = User.createToken(req, user._id);
        user.displayName = profile.emails[0].value;
        user.facebook.id = profile.id;
        user.facebook.token = token;
        // user.facebook.avatar = profile.photos[0].value;
        user.facebook.email = profile.emails[0].value;
        user.save(function (err) {
          if (err) {
            throw err;
          }
          req.flash = setNotify('success', 'Вы успешно вошли.');
          return callback(null, user);
        });
      });
    }
  });
};

passport.use(new FacebookStrategy(config.facebook, init));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = {
  login: passport.authenticate('facebook', { scope: ['email'] }),
  callback: passport.authenticate('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/profile'
  }),
  connect: passport.authorize('facebook', { scope: 'email' }),
  connectCallback: passport.authorize('facebook', {
    successRedirect: '/profile',
    failureRedirect: '/profile'
  }),
  disconnect: function (req, res, next) {
    var user = req.user;
    user.facebook = undefined;
    // user.facebook.id = undefined;
    // user.facebook.token = undefined;
    // user.facebook.email = undefined;
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

