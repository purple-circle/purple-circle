(function() {
  "use strict";
  var GoogleApi, GoogleStrategy, UserApi, express, googleOptions, mongoose, passport, router;

  express = require("express");

  passport = require("passport");

  mongoose = require('mongoose');

  UserApi = require("../models/user");

  GoogleApi = require("../models/google");

  GoogleStrategy = require("passport-google").Strategy;

  router = express.Router();

  googleOptions = {
    returnURL: "http://localhost:3000/auth/google/callback",
    realm: "http://localhost:3000/auth/google/callback"
  };

  router.get("/", passport.authenticate("google"));

  router.get("/callback", passport.authenticate("google", {
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

  passport.use(new GoogleStrategy(googleOptions, function(identifier, profile, done) {
    var Users, profile_id;
    profile_id = identifier.match(/id=(.*)/);
    Users = mongoose.model('users');
    return Users.findOne({
      google_id: profile_id
    }).exec(function(err, data) {
      var google_profile, userData;
      if (err) {
        return done(err);
      } else if (data) {
        return done(null, data);
      } else {
        console.log("profile", profile);
        userData = {
          google_id: profile_id,
          name: profile.displayName,
          username: profile.displayName.replace(" ", ".") + Math.ceil(Math.random() * 1000)
        };
        if (profile.emails.length) {
          userData.email = profile.emails[0].value;
        }
        google_profile = {
          id: profile.profile_id,
          name: profile.displayName,
          first_name: profile.name.givenName,
          last_name: profile.name.familyName,
          emails: profile.emails,
          metadata: profile,
          identifier: identifier
        };
        console.log("sending to GoogleApi");
        return UserApi.create(userData).then(function(result) {
          console.log("google user created", result);
          google_profile.user_id = result._id;
          GoogleApi.save(google_profile);
          return done(null, result);
        }, function(error) {
          console.log("err", error);
          return done(error);
        });
      }
    });
  }));

  module.exports = router;

}).call(this);
