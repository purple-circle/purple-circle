(function() {
  "use strict";
  var InstagramModel, InstagramStrategy, UserApi, api, express, instagramOptions, passport, router;

  express = require("express");

  passport = require("passport");

  api = require("../models/api");

  UserApi = require("../models/user");

  InstagramModel = require("../models/instagram");

  InstagramStrategy = require("passport-instagram").Strategy;

  router = express.Router();

  router.get("/", passport.authenticate("instagram"));

  router.get("/callback", passport.authenticate("instagram", {
    successRedirect: "/login/success",
    failureRedirect: "/login/fail"
  }));

  instagramOptions = {
    clientID: '70a852bf36594e9780e9e3593c2a8d38',
    clientSecret: 'ec808ad011a54f5abd013296b468e494',
    callbackURL: "http://localhost:3000/auth/instagram/callback"
  };

  passport.use(new InstagramStrategy(instagramOptions, function(accessToken, refreshToken, profile, done) {
    var error, success;
    success = function(data) {
      var instagram_profile, userData, username;
      if (data) {
        done(null, data);
        return true;
      }
      if (profile.displayName.length) {
        username = profile.displayName.replace(" ", ".") + Math.ceil(Math.random() * 1000);
      }
      userData = {
        instagram_id: profile.id,
        name: profile.displayName,
        username: username
      };
      instagram_profile = {
        id: profile.id,
        name: profile.displayName,
        first_name: profile.name.givenName,
        last_name: profile.name.familyName,
        bio: profile._json.data.bio,
        website: profile._json.data.website,
        profile_picture: profile._json.data.profile_picture,
        metadata: profile,
        accessToken: accessToken
      };
      return UserApi.create(userData).then(function(result) {
        instagram_profile.user_id = result._id;
        InstagramModel.save(instagram_profile);
        return done(null, result);
      }, function(error) {
        return done(error);
      });
    };
    error = function(err) {
      return done(err);
    };
    return api.getUserByFilters({
      instagram_id: profile.id
    }).then(success, error);
  }));

  module.exports = router;

}).call(this);
