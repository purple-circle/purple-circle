api = require("../models/api")
groups = {}

groups.create = (data) ->
  api.createQueue("api.createGroup", data)

groups.update = (id, data) ->
  groups
    .getGroup(id)
    .then (group) ->
      if group.created_by isnt data.edited_by
        return false

      api.createQueue("api.editGroup", {id, data})

groups.getGroups = (data) ->
  api.createQueue("api.getGroups", data)

groups.getGroup = (id) ->
  api.createQueue("api.getGroup", id)

module.exports = groups
