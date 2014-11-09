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

  createGroup: (data) ->
    socket.emit("createGroup", data)
    this.on("createGroup")

  getGroup: (id) ->
    socket.emit("getGroup", id)
    this.on("getGroup")

  getGroupList: (data) ->
    socket.emit("getGroupList", data)
    this.on("getGroupList")