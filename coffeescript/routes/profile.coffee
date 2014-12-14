"use strict"
express = require("express")
mongoose = require('mongoose')
user = require("../models/user")
router = express.Router()

router.get "/:id", (req, res) ->
  res.render "profile",
    userLoginStatus: req.user isnt undefined

router.get "/:id/*", (req, res) ->
  res.render "profile",
    userLoginStatus: req.user isnt undefined


router.post "/upload", (req, res) ->
  if !req.body.profile_id || !req.files || !req.user
    res.json {saved: false}
    return false

  if !req.files.file
    res.json {saved: false}
    return false

  if !req.files.file.mimetype.match("image")
    res.json {saved: false}
    return false

  data =
    user_id: req.user
    filename: req.files.file.name
    file: req.files.file

  if req.body.title isnt null
    data.title = req.body.title

  user.savePicture(req.body.group_id, data)
  res.jsonp {saved: true}


router.post "/upload/default", (req, res) ->
  if !req.body.profile_id || !req.files || !req.user
    res.json {saved: false}
    return false

  if !req.files.file
    res.json {saved: false}
    return false

  if !req.files.file.mimetype.match("image")
    res.json {saved: false}
    return false

  data =
    user_id: req.user
    filename: req.files.file.name
    file: req.files.file
    default_picture: true

  if req.body.title isnt null
    data.title = req.body.title

  user.savePicture(req.body.group_id, data)
  res.jsonp {saved: true}


module.exports = router