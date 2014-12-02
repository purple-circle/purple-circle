app = angular.module('app')
app.factory 'api', ($q) ->
  socket = io()

  socket: socket

  on: (event) ->
    deferred = $q.defer()
    socket.on event, deferred.resolve
    deferred.promise

  saveComment: (data) ->
    socket.emit("savecomment", data)

  findUser: (id) ->
    socket.emit("getuser", id)
    this.on("user")

  userlist: ->
    socket.emit("getuserlist")

  checkLogin: ->
    window.userLoginStatus

  getLoggedinUser: ->
    socket.emit("getLoggedinUser")
    this.on("getLoggedinUser")

  saveProfileEdit: (id, data) ->
    socket.emit("edit_user", {id, data})
    this.on("edit_user")

  createGroup: (data) ->
    socket.emit("createGroup", data)
    this.on("createGroup")

  saveGroupEdit: (id, data) ->
    socket.emit("editGroup", {id, data})
    this.on("editGroup")

  getGroup: (id) ->
    socket.emit("getGroup", id)
    this.on("getGroup")

  joinGroup: (id) ->
    socket.emit("joinGroup", id)
    this.on("joinGroup")

  getGroupPictures: (id) ->
    socket.emit("getGroupPictures", id)
    this.on("getGroupPictures")

  checkMembership: (id) ->
    socket.emit("checkMembership", id)
    this.on("checkMembership")

  getMemberList: (id) ->
    socket.emit("getMemberList", id)
    this.on("getMemberList")

  getGroupList: (data) ->
    socket.emit("getGroupList", data)
    this.on("getGroupList")

  load_chat_messages: (data) ->
    socket.emit("load_chat_messages", data)
    this.on("load_chat_messages")

  save_chat_message: (data) ->
    socket.emit("save_chat_message", data)
    this.on("save_chat_message")

  getGroupCategories: ->
    [
      {
        name: "Generic"
      }
      {
        name: "Music"
      }
      {
        name: "Development"
      }
    ]