(function() {
  var api, groups;

  api = require("../models/api");

  groups = {};

  groups.create = function(data) {
    return api.createQueue("api.createGroup", data);
  };

  groups.getGroups = function(data) {
    return api.createQueue("api.getGroups", data);
  };

  groups.getGroup = function(id) {
    return api.createQueue("api.getGroup", id);
  };

  module.exports = groups;

}).call(this);
