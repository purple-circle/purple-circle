"use strict"
express = require("express")
passport = require("passport")
api = require('../models/api')
UserApi = require("../models/user")
GoogleModel = require("../models/google")

GoogleStrategy = require("passport-google").Strategy

router = express.Router()

googleOptions =
  returnURL: "http://localhost:3000/auth/google/callback"
  realm: "http://localhost:3000/auth/google/callback"

router.get "/", passport.authenticate("google")

router.get "/callback", passport.authenticate "google",
  successRedirect: "/login/success"
  failureRedirect: "/login/fail"


passport.use new GoogleStrategy googleOptions, (identifier, profile, done) ->

  # hack for now
  profile_id = identifier.match(/id=(.*)/)[1]

  success = (data) ->
    if data
      done null, data
      return true

    if profile.displayName.length
      username = profile.displayName.replace(" ", ".") + Math.ceil(Math.random() * 1000)

    userData =
      google_id: profile_id
      name: profile.displayName
      username: username
      # Username hack for now


    if profile.emails.length
      userData.email = profile.emails[0].value


    google_profile =
      id: profile.profile_id
      name: profile.displayName
      first_name: profile.name.givenName
      last_name: profile.name.familyName
      emails: profile.emails
      metadata: profile
      identifier: identifier


    UserApi
      .create(userData)
      .then (result) ->
        google_profile.user_id = result._id
        GoogleModel.save(google_profile)

        done null, result
      , (error) ->
        done error

  error = (err) ->
    done err

  api
    .getUserByFilters({google_id: profile_id})
    .then success, error


module.exports = router
