api = require("../models/api")
user = {}

user.create = (data) ->
  api.createQueue("api.createUser", data)

user.edit = (id, data) ->
  api.createQueue("api.edit_user", {id, data})

user.localSignup = (data) ->
  api.createQueue("api.localSignupUser", data)

module.exports = user