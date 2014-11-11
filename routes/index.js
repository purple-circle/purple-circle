(function() {
  "use strict";
  var LocalStrategy, UserApi, Users, express, loginOptions, mongoose, passport, router;

  express = require("express");

  passport = require("passport");

  mongoose = require("mongoose");

  LocalStrategy = require("passport-local").Strategy;

  UserApi = require('../models/user');

  router = express.Router();

  router.get("/", function(req, res) {
    return res.render("index", {
      userLoginStatus: req.user !== void 0
    });
  });

  router.get("/logout", function(req, res) {
    req.logout();
    return res.redirect('/');
  });

  router.get("/login", function(req, res) {
    return res.render("login", {
      userLoginStatus: req.user !== void 0,
      loginFailed: false
    });
  });

  router.get("/login/success", function(req, res) {
    return res.redirect('/');
  });

  router.get("/login/fail", function(req, res) {
    return res.render("login", {
      userLoginStatus: req.user !== void 0,
      loginFailed: true
    });
  });

  Users = mongoose.model('users');

  passport.use(new LocalStrategy(Users.authenticate()));

  loginOptions = {
    successRedirect: "/",
    failureRedirect: "/login/fail",
    failureFlash: false
  };

  router.post("/login", passport.authenticate("local", loginOptions), function(req, res) {
    return res.redirect("/");
  });

  router.get("/signup", function(req, res) {
    return res.render("signup", {
      userLoginStatus: req.user !== void 0,
      signupFailed: false
    });
  });

  router.post("/signup", function(req, res) {
    var error, success;
    error = function() {
      return res.render("signup", {
        account: account
      });
    };
    success = function(account) {
      return req.login(account, function() {
        return res.redirect("/");
      });
    };
    return UserApi.localSignup(req.body).then(success, error);
  });

  router.get("/signup/fail", function(req, res) {
    return res.render("signup", {
      userLoginStatus: req.user !== void 0,
      signupFailed: true
    });
  });

  module.exports = router;

}).call(this);
