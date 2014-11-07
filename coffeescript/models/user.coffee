api = require("../models/api")
user = {}

user.create = (data) ->
  api.createQueue("api.createUser", data)

module.exports = user