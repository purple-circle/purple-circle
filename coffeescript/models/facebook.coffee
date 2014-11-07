api = require("../models/api")
facebook = {}

facebook.save = (data) ->
  api.createQueue("api.saveFacebookData", data)

module.exports = facebook