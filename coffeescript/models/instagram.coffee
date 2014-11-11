api = require("../models/api")
instagram = {}

instagram.save = (data) ->
  api.createQueue("api.saveInstagramData", data)

module.exports = instagram