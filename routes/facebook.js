(function() {
  "use strict";
  var FacebookApi, FacebookStrategy, UserApi, express, facebookOptions, facebook_options, mongoose, passport, router;

  express = require("express");

  passport = require("passport");

  FacebookStrategy = require('passport-facebook').Strategy;

  mongoose = require('mongoose');

  router = express.Router();

  UserApi = require("../models/user");

  FacebookApi = require("../models/facebook");

  router.get("/", passport.authenticate("facebook", {
    scope: ['email', 'user_birthday']
  }));

  router.get("/callback", passport.authenticate("facebook", {
    successRedirect: "/login/success",
    failureRedirect: "/login/fail"
  }));

  passport.serializeUser(function(user, done) {
    return done(null, user._id);
  });

  passport.deserializeUser(function(id, done) {
    var Users;
    Users = mongoose.model('users');
    return Users.findOne({
      _id: id
    }).exec(function(err, data) {
      if (err) {
        return done(err);
      } else if (data) {
        return done(null, data._id);
      } else {
        return done('user not found');
      }
    });
  });

  facebook_options = {
    api: "dev",
    options: {
      production: {
        clientID: "",
        clientSecret: "",
        callbackURL: ""
      },
      dev: {
        clientID: 1508640816070423,
        clientSecret: "5343aa8abe52ebf19782922e2a7255dd",
        callbackURL: "http://localhost:3000/auth/facebook/callback"
      }
    }
  };

  facebookOptions = facebook_options.options[facebook_options.api];

  passport.use(new FacebookStrategy(facebookOptions, function(accessToken, refreshToken, profile, done) {
    var Users;
    Users = mongoose.model('users');
    return Users.findOne({
      facebook_id: profile.id
    }).exec(function(err, data) {
      var facebook_profile, userData;
      if (err) {
        return done(err);
      } else if (data) {
        return done(null, data);
      } else {
        userData = {
          facebook_id: profile.id,
          name: profile.displayName,
          gender: profile.gender,
          email: profile._json.email,
          birthday: profile._json.birthday,
          username: profile.displayName.replace(" ", ".") + Math.ceil(Math.random() * 1000)
        };
        facebook_profile = {
          id: profile.id,
          name: profile.displayName,
          url: profile.profileUrl,
          first_name: profile._json.first_name,
          middle_name: profile.name.middleName,
          last_name: profile._json.last_name,
          gender: profile.gender,
          email: profile._json.email,
          emails: profile.emails,
          birthday: profile._json.birthday,
          locale: profile._json.locale,
          timezone: profile._json.timezone,
          verified: profile._json.verified,
          metadata: profile,
          accessToken: accessToken
        };
        return UserApi.create(userData).then(function(result) {
          facebook_profile.user_id = result._id;
          FacebookApi.save(facebook_profile);
          return done(null, result);
        }, function(error) {
          return done(error);
        });
      }
    });
  }));

  module.exports = router;

}).call(this);
