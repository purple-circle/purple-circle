(function() {
  var api, instagram;

  api = require("../models/api");

  instagram = {};

  instagram.save = function(data) {
    return api.createQueue("api.saveInstagramData", data);
  };

  module.exports = instagram;

}).call(this);
