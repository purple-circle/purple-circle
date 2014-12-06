api = require("../models/api")
user = {}

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


module.exports = user