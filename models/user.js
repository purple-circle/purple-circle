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

  user.create_default_picture_album = function(userid) {
    var album_data;
    album_data = {
      user_id: result._id,
      title: "Default album",
      "default": true
    };
    return user.create_picture_album(album_data);
  };

  user.check_username = function(username) {
    return api.createQueue("api.check_username", username);
  };

  user.create = function(data) {
    var deferred;
    deferred = Q.defer();
    api.createQueue("api.createUser", data).then(function(result) {
      return user.create_default_picture_album(result._id).then(function() {
        return deferred.resolve(result);
      });
    }, deferred.reject);
    return deferred.promise;
  };

  user.edit = function(id, data) {
    return api.createQueue("api.edit_user", {
      id: id,
      data: data
    });
  };

  user.localSignup = function(data) {
    var deferred;
    deferred = Q.defer();
    api.createQueue("api.localSignupUser", data).then(function(result) {
      return user.create_default_picture_album(result._id).then(function() {
        return deferred.resolve(result);
      });
    }, deferred.reject);
    return deferred.promise;
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

  user.create_picture_album = function(data) {
    if (!data.user_id) {
      return rejectPromise();
    }
    return api.createQueue("api.create_profile_picture_album", data);
  };

  user.get_profile_picture_albums = function(id) {
    return api.createQueue("api.get_profile_picture_albums", id);
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

  user.set_cover_picture = function(user_id, picture_id) {
    var deferred;
    deferred = Q.defer();
    user.get_profile_picture(user_id, picture_id).then(function(picture) {
      var data;
      data = {
        cover_url: "/uploads/" + picture.filename
      };
      return user.edit(user_id, data).then(deferred.resolve, deferred.reject);
    }, deferred.reject);
    return deferred.promise;
  };

  module.exports = user;

}).call(this);
