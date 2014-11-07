"use strict"
express = require("express")
mongoose = require('mongoose')
router = express.Router()

router.get "/:id", (req, res) ->
  res.render "profile",
    userLoginStatus: req.user isnt undefined

module.exports = router