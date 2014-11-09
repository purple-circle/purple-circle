module.exports = (server, sessionStore) ->
  io = require("socket.io").listen(server)
  api = require("./models/api")
  groups = require("./models/groups")

  io.use (socket, next) ->
    sessionStore socket.request, socket.request.res, next

  io.on "connection", (socket) ->
    socket.on "getuser", (data) ->
      api
        .getUser(data)
        .then (user) ->
          socket.emit "user", user

    socket.on "getuserlist", (data) ->
      api
        .getUserlist()
        .then (data) ->
          socket.emit "userlist", data

    socket.on "checkLogin", (data) ->
      loggedinUser = socket.request?.session?.passport?.user?
      socket.emit "checkLogin", loggedinUser

    socket.on "getLoggedinUser", ->
      loggedinUser = socket.request?.session?.passport?.user
      if !loggedinUser
        return false

      api
        .getUser(loggedinUser)
        .then (user) ->
          socket.emit "getLoggedinUser", user

    socket.on "getGroup", (id) ->
      groups
        .getGroup(id)
        .then (group) ->
          socket.emit "getGroup", group

    socket.on "getGroupList", ->
      groups
        .getGroups()
        .then (result) ->
          socket.emit "getGroupList", result

    socket.on "createGroup", (data) ->
      loggedinUser = socket.request?.session?.passport?.user?
      if !data.name
        return

      if !loggedinUser
        return

      data.created_by = socket.request?.session?.passport?.user

      groups
        .create(data)
        .then (result) ->
          socket.emit "createGroup", result
          socket.broadcast.emit "createGroup", result
