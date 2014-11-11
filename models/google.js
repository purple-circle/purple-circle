(function() {
  var api, google;

  api = require("../models/api");

  google = {};

  google.save = function(data) {
    return api.createQueue("api.saveGoogleData", data);
  };

  module.exports = google;

}).call(this);
