api = require("../models/api")
google = {}

google.save = (data) ->
  api.createQueue("api.saveGoogleData", data)

module.exports = google