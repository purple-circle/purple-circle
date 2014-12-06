(function() {
  var api, user;

  api = require("../models/api");

  user = {};

  user.create = function(data) {
    return api.createQueue("api.createUser", data);
  };

  user.edit = function(id, data) {
    return api.createQueue("api.edit_user", {
      id: id,
      data: data
    });
  };

  user.localSignup = function(data) {
    return api.createQueue("api.localSignupUser", data);
  };

  user.getUser = function(id) {
    return api.createQueue("api.getUser", {
      _id: id
    });
  };

  user.savePicture = function(id, data) {
    return user.getUser(id).then(function(profile) {
      if (!profile) {
        return rejectPromise();
      }
      return api.createQueue("api.saveProfilePicture", {
        id: id,
        data: data
      });
    });
  };

  user.getPictures = function(id) {
    return api.createQueue("api.getProfilePictures", id);
  };

  module.exports = user;

}).call(this);
