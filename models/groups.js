(function() {
  var api, groups;

  api = require("../models/api");

  groups = {};

  groups.create = function(data) {
    return api.createQueue("api.createGroup", data);
  };

  groups.update = function(id, data) {
    return groups.getGroup(id).then(function(group) {
      if (group.created_by !== data.edited_by) {
        return false;
      }
      return api.createQueue("api.editGroup", {
        id: id,
        data: data
      });
    });
  };

  groups.getGroups = function(data) {
    return api.createQueue("api.getGroups", data);
  };

  groups.getGroup = function(id) {
    return api.createQueue("api.getGroup", id);
  };

  module.exports = groups;

}).call(this);
