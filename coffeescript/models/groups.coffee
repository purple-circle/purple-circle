api = require("../models/api")
groups = {}

groups.create = (data) ->
  api.createQueue("api.createGroup", data)

groups.getGroups = (data) ->
  api.createQueue("api.getGroups", data)

groups.getGroup = (id) ->
  api.createQueue("api.getGroup", id)

module.exports = groups
