(function() {
  var api, user;

  api = require("../models/api");

  user = {};

  user.create = function(data) {
    return api.createQueue("api.createUser", data);
  };

  module.exports = user;

}).call(this);
