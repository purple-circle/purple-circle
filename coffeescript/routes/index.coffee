"use strict"
express = require("express")
passport = require("passport")
mongoose = require("mongoose")
LocalStrategy = require("passport-local").Strategy
UserApi = require('../models/user')

router = express.Router()

router.get "/", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

router.get "/logout", (req, res) ->
  req.logout()
  res.redirect('/')

router.get "/login", (req, res) ->
  res.render "login",
    userLoginStatus: req.user isnt undefined
    loginFailed: false

router.get "/login/success", (req, res) ->
  res.redirect('/')

router.get "/login/fail", (req, res) ->
  res.render "login",
    userLoginStatus: req.user isnt undefined
    loginFailed: true

router.get "/api_stats", (req, res) ->
  res.render "index",
    userLoginStatus: req.user isnt undefined

Users = mongoose.model 'users'
passport.use new LocalStrategy(Users.authenticate())

loginOptions =
  successRedirect: "/"
  failureRedirect: "/login/fail"
  failureFlash: false

router.post "/login", passport.authenticate("local", loginOptions), (req, res) ->
  res.redirect "/"

router.get "/signup", (req, res) ->
  res.render "signup",
    userLoginStatus: req.user isnt undefined
    signupFailed: false

router.post "/signup", (req, res) ->
  error = ->
    res.render "signup",
      account: account

  success = (account) ->
    req.login account, ->
      res.redirect "/"

  UserApi
    .localSignup(req.body)
    .then success, error


router.get "/signup/fail", (req, res) ->
  res.render "signup",
    userLoginStatus: req.user isnt undefined
    signupFailed: true


module.exports = router