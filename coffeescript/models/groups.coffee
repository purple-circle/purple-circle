Q = require("q")
api = require("../models/api")
groups = {}

rejectPromise = ->
  deferred = Q.defer()
  deferred.reject()
  deferred.promise

groups.create = (data) ->
  api
    .createQueue("api.createGroup", data)
    .then (group) ->
      joinData =
        group_id: group._id
        user_id: group.created_by

      albumData = joinData
      albumData.title = "Default album"
      albumData.default = true

      groups.createPictureAlbum(albumData)
      groups.joinGroup(joinData)
      group

groups.joinGroup = (data) ->
  if !data.group_id || !data.user_id
    return rejectPromise()

  groups
    .getGroup(data.group_id)
    .then (group) ->
      if !group
        return rejectPromise()

      api.createQueue("api.joinGroup", data)

groups.createPictureAlbum = (data) ->
  if !data.group_id || !data.user_id
    return rejectPromise()

  groups
    .getGroup(data.group_id)
    .then (group) ->
      if !group
        return rejectPromise()

      api.createQueue("api.createGroupPictureAlbum", data)


groups.leaveGroup = (data) ->
  if !data.group_id || !data.user_id
    return rejectPromise()

  groups
    .getGroup(data.group_id)
    .then (group) ->
      if !group
        return rejectPromise()

      api.createQueue("api.leaveGroup", data)


groups.checkMembership = (data) ->
  if !data.group_id || !data.user_id
    return rejectPromise()

  api.createQueue("api.checkMembership", data)


groups.getMemberList = (id) ->
  api.createQueue("api.getMemberList", id)


groups.savePicture = (id, data) ->
  groups
    .getGroup(id)
    .then (group) ->
      if !group
        return rejectPromise()

      api.createQueue("api.saveGroupPicture", {id, data})

groups.getPictures = (id) ->
  api.createQueue("api.getGroupPictures", id)

groups.getPictureAlbums = (id) ->
  api.createQueue("api.getGroupPictureAlbums", id)

groups.update = (id, data) ->
  groups
    .getGroup(id)
    .then (group) ->
      if !group
        return rejectPromise()
      if group.created_by isnt data.edited_by
        return rejectPromise()

      api.createQueue("api.editGroup", {id, data})

groups.getGroups = (data) ->
  api.createQueue("api.getGroups", data)

groups.getGroup = (id) ->
  api.createQueue("api.getGroup", id)

module.exports = groups
