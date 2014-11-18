(function() {
  "use strict";
  var express, mongoose, router;

  express = require("express");

  mongoose = require('mongoose');

  router = express.Router();

  router.get("/:id", function(req, res) {
    return res.render("profile", {
      userLoginStatus: req.user !== void 0
    });
  });

  router.get("/:id/*", function(req, res) {
    return res.render("profile", {
      userLoginStatus: req.user !== void 0
    });
  });

  module.exports = router;

}).call(this);
