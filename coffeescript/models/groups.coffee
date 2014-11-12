Q = require("q")
api = require("../models/api")
groups = {}

rejectPromise = ->
  deferred = Q.defer()
  deferred.reject()
  deferred.promise

groups.create = (data) ->
  api.createQueue("api.createGroup", data)

groups.joinGroup = (data) ->
  if !data.group_id || !data.user_id
    return rejectPromise()

  groups
    .getGroup(data.group_id)
    .then (group) ->
      if !group
        return rejectPromise()

      api.createQueue("api.joinGroup", data)

groups.getMemberList = (id) ->
  api.createQueue("api.getMemberList", id)



groups.update = (id, data) ->
  groups
    .getGroup(id)
    .then (group) ->
      if group.created_by isnt data.edited_by
        return rejectPromise()

      api.createQueue("api.editGroup", {id, data})

groups.getGroups = (data) ->
  api.createQueue("api.getGroups", data)

groups.getGroup = (id) ->
  api.createQueue("api.getGroup", id)

module.exports = groups
