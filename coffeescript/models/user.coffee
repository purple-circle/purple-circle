Q = require("q")
api = require("../models/api")
user = {}

rejectPromise = ->
  deferred = Q.defer()
  deferred.reject()
  deferred.promise

user.create = (data) ->
  api.createQueue("api.createUser", data)

user.edit = (id, data) ->
  api.createQueue("api.edit_user", {id, data})

user.localSignup = (data) ->
  api.createQueue("api.localSignupUser", data)

user.getUser = (id) ->
  api.createQueue("api.getUser", {_id: id})

user.savePicture = (id, data) ->
  user
    .getUser(id)
    .then (profile) ->
      if !profile
        return rejectPromise()

      api.createQueue("api.saveProfilePicture", {id, data})

user.getPictures = (id) ->
  api.createQueue("api.getProfilePictures", id)

user.get_profile_picture = (user_id, picture_id) ->
  api.createQueue("api.get_profile_picture", {user_id, picture_id})

user.set_profile_picture = (user_id, picture_id) ->
  deferred = Q.defer()

  user
    .get_profile_picture(user_id, picture_id)
    .then (picture) ->
      data =
        picture_url: "/uploads/#{picture.filename}"

      user
        .edit(user_id, data)
        .then deferred.resolve, deferred.reject

    , deferred.reject

  deferred.promise


module.exports = user