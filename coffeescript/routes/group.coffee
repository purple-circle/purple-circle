"use strict"
express = require("express")

router = express.Router()

router.get "/:id", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

router.get "/:id/edit", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

module.exports = router