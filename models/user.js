(function() {
  var api, user;

  api = require("../models/api");

  user = {};

  user.create = function(data) {
    return api.createQueue("api.createUser", data);
  };

  user.localSignup = function(data) {
    return api.createQueue("api.localSignupUser", data);
  };

  module.exports = user;

}).call(this);
