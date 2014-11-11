(function() {
  "use strict";
  var FacebookModel, FacebookStrategy, UserApi, api, express, facebookOptions, facebook_options, passport, router;

  express = require("express");

  passport = require("passport");

  api = require('../models/api');

  UserApi = require("../models/user");

  FacebookModel = require("../models/facebook");

  FacebookStrategy = require('passport-facebook').Strategy;

  router = express.Router();

  router.get("/", passport.authenticate("facebook", {
    scope: ['email', 'user_birthday']
  }));

  router.get("/callback", passport.authenticate("facebook", {
    successRedirect: "/login/success",
    failureRedirect: "/login/fail"
  }));

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
    var error, success;
    error = function(err) {
      return done(err);
    };
    success = function(data) {
      var facebook_profile, userData, username;
      if (data) {
        done(null, data);
        return true;
      }
      if (profile.displayName.length) {
        username = profile.displayName.replace(" ", ".") + Math.ceil(Math.random() * 1000);
      }
      userData = {
        facebook_id: profile.id,
        name: profile.displayName,
        gender: profile.gender,
        email: profile._json.email,
        birthday: profile._json.birthday,
        username: username
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
        FacebookModel.save(facebook_profile);
        return done(null, result);
      }, function(error) {
        return done(error);
      });
    };
    return api.getUserByFilters({
      facebook_id: profile.id
    }).then(success, error);
  }));

  module.exports = router;

}).call(this);
