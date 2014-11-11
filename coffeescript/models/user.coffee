api = require("../models/api")
user = {}

user.create = (data) ->
  api.createQueue("api.createUser", data)

user.localSignup = (data) ->
  api.createQueue("api.localSignupUser", data)

module.exports = user