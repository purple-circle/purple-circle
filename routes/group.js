(function() {
  "use strict";
  var express, groups, router;

  express = require("express");

  groups = require("../models/groups");

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

  router.post("/upload", function(req, res) {
    var data;
    if (!req.body.group_id || !req.files || !req.user) {
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
      group_id: req.body.group_id,
      user_id: req.user,
      filename: req.files.file.name,
      file: req.files.file
    };
    if (req.body.title !== null) {
      data.title = req.body.title;
    }
    groups.savePicture(req.body.group_id, data);
    return res.jsonp({
      saved: true
    });
  });

  module.exports = router;

}).call(this);
