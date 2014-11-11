(function() {
  "use strict";
  var express, router;

  express = require("express");

  router = express.Router();

  router.get("/", function(req, res) {
    return res.render("index", {
      userLoginStatus: req.user !== void 0
    });
  });

  router.get("/groups", function(req, res) {
    return res.render("index", {
      userLoginStatus: req.user !== void 0
    });
  });

  router.get("/groups/:category", function(req, res) {
    return res.render("index", {
      userLoginStatus: req.user !== void 0
    });
  });

  module.exports = router;

}).call(this);
