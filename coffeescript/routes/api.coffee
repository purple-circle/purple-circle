"use strict"
express = require("express")
api = require("../models/api")
router = express.Router()


router.get "/userlist", (req, res) ->
  api
    .getUserlist()
    .then (data) ->
      res.jsonp data

router.get "/user/:id", (req, res) ->
  api
    .getUser(req.params.id)
    .then (data) ->
      data.isLoggedinUser = req.user is data.id

      res.jsonp data

module.exports = router
