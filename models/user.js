(function() {
  var Q, api, rejectPromise, user;

  Q = require("q");

  api = require("../models/api");

  user = {};

  rejectPromise = function() {
    var deferred;
    deferred = Q.defer();
    deferred.reject();
    return deferred.promise;
  };

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

  user.get_profile_picture = function(user_id, picture_id) {
    return api.createQueue("api.get_profile_picture", {
      user_id: user_id,
      picture_id: picture_id
    });
  };

  user.set_profile_picture = function(user_id, picture_id) {
    var deferred;
    deferred = Q.defer();
    user.get_profile_picture(user_id, picture_id).then(function(picture) {
      var data;
      data = {
        picture_url: "/uploads/" + picture.filename
      };
      return user.edit(user_id, data).then(deferred.resolve, deferred.reject);
    }, deferred.reject);
    return deferred.promise;
  };

  module.exports = user;

}).call(this);
