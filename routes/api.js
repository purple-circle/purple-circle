(function() {
  "use strict";
  var api, express, router;

  express = require("express");

  api = require("../models/api");

  router = express.Router();

  router.get("/userlist", function(req, res) {
    return api.getUserlist().then(function(data) {
      return res.jsonp(data);
    });
  });

  router.get("/user/:id", function(req, res) {
    return api.getUser(req.params.id).then(function(data) {
      data.isLoggedinUser = req.user === data.id;
      return res.jsonp(data);
    });
  });

  module.exports = router;

}).call(this);
