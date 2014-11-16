"use strict"
express = require("express")
groups = require("../models/groups")
router = express.Router()

router.get "/:id", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

router.get "/:id/edit", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

router.post "/upload", (req, res) ->
  if !req.body.group_id || !req.files || !req.user
    res.json {saved: false}
    return false

  if !req.files.file
    res.json {saved: false}
    return false

  if !req.files.file.mimetype.match("image")
    res.json {saved: false}
    return false

  data =
    group_id: req.body.group_id
    user_id: req.user
    filename: req.files.file.name
    file: req.files

  if req.body.title isnt null
    data.title = req.body.title

  groups.savePicture(req.body.group_id, data)
  res.jsonp {saved: true}


module.exports = router