module.exports = (server, sessionStore) ->
  io = require("socket.io").listen(server)
  api = require("./models/api")
  groups = require("./models/groups")
  user = require("./models/user")
  chat = require("./models/chat")
  Q = require("q")

  io.use (socket, next) ->
    sessionStore socket.request, socket.request.res, next

  io.on "connection", (socket) ->
    socket.on "getuser", (data) ->
      api
        .getUser(data)
        .then (user) ->
          loggedin_user = socket.request?.session?.passport?.user
          user.my_profile = loggedin_user is user._id
          socket.emit "user", user


    socket.on "edit_user", ({id, data}) ->
      userid = socket.request?.session?.passport?.user
      loggedin_user = userid?

      if !loggedin_user
        return

      delete data._id

      user
        .edit(id, data)
        .then (result) ->
          socket.emit "edit_user", result


    socket.on "getProfilePictures", (id) ->
      user
        .getPictures(id)
        .then (result) ->
          socket.emit "getProfilePictures", result


    socket.on "set_profile_picture", ({user_id, picture_id}) ->
      user
        .set_profile_picture(user_id, picture_id)
        .then (result) ->
          socket.emit "set_profile_picture", result


    socket.on "set_cover_picture", ({user_id, picture_id}) ->
      user
        .set_cover_picture(user_id, picture_id)
        .then (result) ->
          socket.emit "set_cover_picture", result


    socket.on "getuserlist", (data) ->
      api
        .getUserlist()
        .then (data) ->
          socket.emit "userlist", data

    socket.on "checkLogin", (data) ->
      loggedin_user = socket.request?.session?.passport?.user?
      socket.emit "checkLogin", loggedin_user

    socket.on "getLoggedinUser", ->
      loggedin_user = socket.request?.session?.passport?.user
      if !loggedin_user
        return false

      api
        .getUser(loggedin_user)
        .then (user) ->
          socket.emit "getLoggedinUser", user

    socket.on "get_group", (id) ->
      groups
        .getGroup(id)
        .then (group) ->
          socket.emit "get_group", group

    socket.on "joinGroup", (id) ->
      loggedin_user = socket.request?.session?.passport?.user
      if !loggedin_user
        return false

      data =
        group_id: id
        user_id: loggedin_user

      groups
        .joinGroup(data)
        .then (result) ->
          socket.emit "joinGroup", result


    socket.on "leaveGroup", (id) ->
      loggedin_user = socket.request?.session?.passport?.user
      if !loggedin_user
        return false

      data =
        group_id: id
        user_id: loggedin_user

      groups
        .leaveGroup(data)
        .then (result) ->
          socket.emit "leaveGroup", result


    socket.on "set_group_logo", ({group_id, picture_id}) ->
      groups
        .set_group_logo(group_id, picture_id)
        .then (result) ->
          socket.emit "set_group_logo", result


    socket.on "set_group_cover_picture", ({group_id, picture_id}) ->
      groups
        .set_group_cover_picture(group_id, picture_id)
        .then (result) ->
          socket.emit "set_group_cover_picture", result



    socket.on "checkMembership", (id) ->
      loggedin_user = socket.request?.session?.passport?.user
      if !loggedin_user
        socket.emit "checkMembership", false
        return false

      data =
        group_id: id
        user_id: loggedin_user

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
            list.push user.getUser(member.user_id)

          Q.all(list)
            .then (users) ->
              socket.emit "getMemberList", users

    socket.on "getGroupList", (data) ->
      groups
        .getGroups(data)
        .then (result) ->
          socket.emit "getGroupList", result

    socket.on "getGroupPictures", (id) ->
      groups
        .getPictures(id)
        .then (result) ->
          socket.emit "getGroupPictures", result

    socket.on "getGroupPictureAlbums", (id) ->
      groups
        .getPictureAlbums(id)
        .then (result) ->
          socket.emit "getGroupPictureAlbums", result

    socket.on "createGroup", (data) ->
      loggedin_user = socket.request?.session?.passport?.user?
      if !data.name
        return

      if !loggedin_user
        return

      data.created_by = socket.request?.session?.passport?.user

      groups
        .create(data)
        .then (result) ->
          socket.emit "createGroup", result
          socket.broadcast.emit "createGroup", result

    socket.on "create_fanpage_group", (data) ->
      loggedin_user = socket.request?.session?.passport?.user?

      if !loggedin_user
        return

      user
        .getUser(data)
        .then (fanpage_user) ->
          user_name = fanpage_user.name || fanpage_user.username

          group_data =
            name: "#{user_name}'s fan page"
            category: "fanpage"
            created_by: socket.request?.session?.passport?.user

          groups
            .create(group_data)
            .then (result) ->

              user
                .edit(fanpage_user._id, {fanpage_id: result._id})
                .then ->
                  socket.emit "createGroup", result
                  socket.broadcast.emit "createGroup", result
                  socket.emit "create_fanpage_group", result
                  socket.broadcast.emit "create_fanpage_group", result


    socket.on "editGroup", ({id, data}) ->
      userid = socket.request?.session?.passport?.user
      loggedin_user = userid?
      if !data.name
        return

      if !loggedin_user
        return

      data.edited_by = userid
      delete data._id

      groups
        .update(id, data)
        .then (result) ->
          socket.emit "editGroup", result


    socket.on "load_chat_messages", ({action, target}) ->
      chat
        .load_messages(action, target)
        .then (messages) ->
          message_users = {}
          for message in messages
            message_users[message.user_id] = message.user_id

          list = []
          for message_user of message_users
            list.push user.getUser(message_user)

          Q.all(list)
            .then (users) ->
              for message in messages
                for message_user in users when message_user._id is message.user_id
                  message.username = message_user.name || message_user.username
                  message.username_link = message_user.username

              socket.emit "load_chat_messages", messages


    socket.on "save_chat_message", (data) ->
      loggedin_user = socket.request?.session?.passport?.user?
      if !data.target || !data.action
        return

      if !loggedin_user
        return

      data.user_id = socket.request?.session?.passport?.user

      chat
        .save(data)
        .then (result) ->
          user
            .getUser(data.user_id)
            .then (message_user) ->
              result.username = message_user.name || message_user.username
              result.username_link = message_user.username

              socket.emit "save_chat_message", result
              socket.broadcast.emit "save_chat_message", result

