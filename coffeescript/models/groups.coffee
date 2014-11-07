api = require("../models/api")
groups = {}

groups.create = (data) ->
  api.createQueue("api.createGroup", data)

groups.getGroups = ->
  api.createQueue("api.getGroups")

groups.getGroup = (id) ->
  api.createQueue("api.getGroup", id)

module.exports = groups
