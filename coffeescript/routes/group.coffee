"use strict"
express = require("express")
passport = require("passport")
mongoose = require("mongoose")
LocalStrategy = require("passport-local").Strategy

router = express.Router()

router.get "/:id", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

router.get "/:id/edit", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

module.exports = router