module.exports = (server, sessionStore) ->
  io = require("socket.io").listen(server)
  api = require("./models/api")
  groups = require("./models/groups")
  Q = require("q")

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

    socket.on "joinGroup", (id) ->
      loggedinUser = socket.request?.session?.passport?.user
      if !loggedinUser
        return false

      data =
        group_id: id
        user_id: loggedinUser

      groups
        .joinGroup(data)
        .then (result) ->
          socket.emit "joinGroup", result


    socket.on "checkMembership", (id) ->
      loggedinUser = socket.request?.session?.passport?.user
      if !loggedinUser
        socket.emit "checkMembership", false
        return false

      data =
        group_id: id
        user_id: loggedinUser

      groups
        .checkMembership(data)
        .then (membership) ->
          socket.emit "checkMembership", membership

    socket.on "getMemberList", (id) ->
      groups
        .getMemberList(id)
        .then (members) ->
          list = []
          for member in members
            list.push api.getUser(member.user_id)

          Q.all(list)
            .then (users) ->
              socket.emit "getMemberList", users

    socket.on "getGroupList", (data) ->
      groups
        .getGroups(data)
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

    socket.on "editGroup", ({id, data}) ->
      userid = socket.request?.session?.passport?.user
      loggedinUser = userid?
      if !data.name
        return

      if !loggedinUser
        return

      data.edited_by = userid
      delete data._id

      groups
        .update(id, data)
        .then (result) ->
          socket.emit "editGroup", result
