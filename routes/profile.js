(function() {
  "use strict";
  var express, mongoose, router, user;

  express = require("express");

  mongoose = require('mongoose');

  user = require("../models/user");

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

  router.post("/upload", function(req, res) {
    var data;
    if (!req.body.profile_id || !req.files || !req.user) {
      res.json({
        saved: false
      });
      return false;
    }
    if (!req.files.file) {
      res.json({
        saved: false
      });
      return false;
    }
    if (!req.files.file.mimetype.match("image")) {
      res.json({
        saved: false
      });
      return false;
    }
    data = {
      user_id: req.user,
      filename: req.files.file.name,
      file: req.files.file
    };
    if (req.body.title !== null) {
      data.title = req.body.title;
    }
    user.savePicture(req.body.group_id, data);
    return res.jsonp({
      saved: true
    });
  });

  module.exports = router;

}).call(this);
