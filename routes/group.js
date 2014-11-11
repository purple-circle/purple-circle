(function() {
  "use strict";
  var express, router;

  express = require("express");

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
