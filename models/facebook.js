(function() {
  var api, facebook;

  api = require("../models/api");

  facebook = {};

  facebook.save = function(data) {
    return api.createQueue("api.saveFacebookData", data);
  };

  module.exports = facebook;

}).call(this);
