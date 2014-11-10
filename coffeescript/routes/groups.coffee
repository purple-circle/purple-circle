"use strict"
express = require("express")
passport = require("passport")
mongoose = require("mongoose")
LocalStrategy = require("passport-local").Strategy

router = express.Router()

router.get "/", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined



router.get "/groups", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

router.get "/groups/:category", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

module.exports = router