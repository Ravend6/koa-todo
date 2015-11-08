'use strict';

var _ = require('lodash');
var util = require('util');
var passport = require('koa-passport');
var SteamStrategy = require('passport-steam').Strategy;
var User = require('../../models/user');
var config = require('../../config');
var setNotify = require('../helpers/notify');
// var validator = require('../helpers/validator');

var init = function (req, identifier, profile, callback) {
  process.nextTick(function () {
    User.findOne({
      'steam.openId': identifier
    }, function (err, data) {
      if (err) {
        return callback(err);
      }
      if (data) {
        return callback(null, data);
      }
      var user = new User();
      user.token = User.createToken(req, user._id);
      user.displayName = profile.displayName;
      user.steam.openId = identifier;
      user.steam.id = profile.id;
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

passport.use(new SteamStrategy(config.steam, init));

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = {
  login: passport.authenticate('steam', {
    scope: ['email']
  }),
  callback: passport.authenticate('steam', {
    successRedirect: '/profile',
    failureRedirect: '/profile'
  })
};