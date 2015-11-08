'use strict';

var _ = require('lodash');
var util = require('util');
var passport = require('koa-passport');
var VkontakteStrategy = require('passport-vkontakte').Strategy;
var User = require('../../models/user');
var config = require('../../config');
var setNotify = require('../helpers/notify');
// var validator = require('../helpers/validator');

var init = function (req, token, refreshToken, profile, scope, callback) {
  process.nextTick(function () {
    // console.log(profile);
    User.findOne({
      'vkontakte.id': profile.user_id
    }, function (err, data) {
      if (err) {
        return callback(err);
      }
      if (data) {
        return callback(null, data);
      }
      var user = new User();
      user.token = User.createToken(req, user._id);
      user.displayName = profile.email;
      user.vkontakte.id = profile.user_id;
      user.vkontakte.token = token;
      user.vkontakte.email = profile.email;
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

passport.use(new VkontakteStrategy(config.vkontakte, init));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = {
  login: passport.authenticate('vkontakte', {
    scope: ['email']
  }),
  callback: passport.authenticate('vkontakte', {
    successRedirect: '/profile',
    failureRedirect: '/profile'
  })
};