app = angular.module('app')
app.factory 'api', ($q, $upload) ->
  socket = io()

  socket: socket

  upload_picture: (file, options) ->
    data = {}

    if options.group_id
      data.group_id = options.group_id

    if options.profile_id
      data.profile_id = options.profile_id

    if options.title
      data.title = options.title

    if options.album
      data.album_id = options.album_id

    url = options.url

    $upload
      .upload
        url: url
        data: data
        file: file
      .progress (evt) ->
        console.log "percent: " + parseInt(100.0 * evt.loaded / evt.total)
      .success (data, status, headers, config) ->
        console.log "upload data", data
        # TODO remove this, controller should get push from backend when there is a upload
        if options.update
          options.update()


  on: (event) ->
    deferred = $q.defer()
    socket.once event, deferred.resolve
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

  getProfilePictures: (id) ->
    socket.emit("getProfilePictures", id)
    this.on("getProfilePictures")

  get_profile_picture_albums: (id) ->
    socket.emit("get_profile_picture_albums", id)
    this.on("get_profile_picture_albums")

  set_profile_picture: (user_id, picture_id) ->
    socket.emit("set_profile_picture", {user_id, picture_id})
    this.on("set_profile_picture")

  set_cover_picture: (user_id, picture_id) ->
    socket.emit("set_cover_picture", {user_id, picture_id})
    this.on("set_cover_picture")

  set_group_logo: (group_id, picture_id) ->
    socket.emit("set_group_logo", {group_id, picture_id})
    this.on("set_group_logo")

  set_group_cover_picture: (group_id, picture_id) ->
    socket.emit("set_group_cover_picture", {group_id, picture_id})
    this.on("set_group_cover_picture")

  create_fanpage_group: (user_id) ->
    socket.emit("create_fanpage_group", user_id)
    this.on("create_fanpage_group")

  createGroup: (data) ->
    socket.emit("createGroup", data)
    this.on("createGroup")

  saveGroupEdit: (id, data) ->
    socket.emit("editGroup", {id, data})
    this.on("editGroup")

  getGroup: (id) ->
    socket.emit("get_group", id)
    this.on("get_group")

  joinGroup: (id) ->
    socket.emit("joinGroup", id)
    this.on("joinGroup")

  leaveGroup: (id) ->
    socket.emit("leaveGroup", id)
    this.on("leaveGroup")

  getGroupPictures: (id) ->
    socket.emit("getGroupPictures", id)
    this.on("getGroupPictures")

  getGroupPictureAlbums: (id) ->
    socket.emit("getGroupPictureAlbums", id)
    this.on("getGroupPictureAlbums")

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
      {
        name: "Cartoon"
      }
      {
        name: "Fanpage"
      }
    ]

  getGenders: ->
    [
      {
        name: "male"
      }
      {
        name: "female"
      }
      {
        name: "doge"
      }
      {
        name: "furry"
      }
      {
        name: "yolo"
      }
    ]