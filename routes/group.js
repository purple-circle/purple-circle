(function() {
  "use strict";
  var LocalStrategy, express, mongoose, passport, router;

  express = require("express");

  passport = require("passport");

  mongoose = require("mongoose");

  LocalStrategy = require("passport-local").Strategy;

  router = express.Router();

  router.get("/:id", function(req, res) {
    return res.render("index", {
      userLoginStatus: req.user !== void 0
    });
  });

  router.get("/:id/edit", function(req, res) {
    return res.render("index", {
      userLoginStatus: req.user !== void 0
    });
  });

  module.exports = router;

}).call(this);
