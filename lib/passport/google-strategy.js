'use strict';

var _ = require('lodash');
var util = require('util');
var passport = require('koa-passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var User = require('../../models/user');
var config = require('../../config');
var setNotify = require('../helpers/notify');
// var validator = require('../helpers/validator');

var init = function (req, token, refreshToken, profile, callback) {
  process.nextTick(function () {
    User.findOne({
      'google.id': profile.id
    }, function (err, data) {
      if (err) {
        return callback(err);
      }
      if (data) {
        return callback(null, data);
      }
      var user = new User();
      user.token = User.createToken(req, user._id);
      user.displayName = profile.emails[0].value;
      user.google.id = profile.id;
      user.google.token = token;
      user.google.email = profile.emails[0].value;
      user.save(function (err) {
        if (err) {
          throw err;
        }
        req.flash = setNotify('success', 'Вы успешно вошли.');
        return callback(null, user);
      });
    });
  });
};

passport.use(new GoogleStrategy(config.google, init));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = {
  login: passport.authenticate('google', {
    scope: [
      'https://www.googleapis.com/auth/plus.login',
      'https://www.googleapis.com/auth/userinfo.email'
    ]
  }),
  callback: passport.authenticate('google', {
    successRedirect: '/profile',
    // failureRedirect: '/profile'
  })
};