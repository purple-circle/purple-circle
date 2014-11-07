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

  userlist: ->
    socket.emit("getuserlist")

  checkLogin: ->
    window.userLoginStatus

  createGroup: (data) ->
    socket.emit("createGroup", data)
    this.on("createGroup")

  getGroup: (id) ->
    socket.emit("getGroup", id)
    this.on("getGroup")

  getGroupList: ->
    socket.emit("getGroupList")
    this.on("getGroupList")