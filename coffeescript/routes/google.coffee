"use strict"
express = require("express")
passport = require("passport")
mongoose = require('mongoose')

UserApi = require("../models/user")
GoogleApi = require("../models/google")

GoogleStrategy = require("passport-google").Strategy

router = express.Router()

googleOptions =
  returnURL: "http://localhost:3000/auth/google/callback"
  realm: "http://localhost:3000/auth/google/callback"

router.get "/", passport.authenticate("google")

router.get "/callback", passport.authenticate "google",
  successRedirect: "/login/success"
  failureRedirect: "/login/fail"

passport.serializeUser (user, done) ->
  done null, user._id

passport.deserializeUser (id, done) ->
  Users = mongoose.model 'users'
  Users
    .findOne({_id: id})
    .exec (err, data) ->
      if err
        done err
      else if data
        done null, data._id
      else
        done 'user not found'

      #done null, {id: 1}


passport.use new GoogleStrategy googleOptions, (identifier, profile, done) ->

  # hack for now
  profile_id = identifier.match(/id=(.*)/)

  Users = mongoose.model 'users'
  Users
    .findOne({google_id: profile_id})
    .exec (err, data) ->

      if err
        done(err)
      else if data
        done null, data

      else

        console.log "profile", profile


        userData =
          google_id: profile_id
          name: profile.displayName
          username: profile.displayName.replace(" ", ".") + Math.ceil(Math.random() * 1000)
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


        console.log "sending to GoogleApi"

        UserApi
          .create(userData)
          .then (result) ->

            console.log "google user created", result

            google_profile.user_id = result._id
            GoogleApi.save(google_profile)

            done null, result
          , (error) ->
            console.log "err", error
            done error



module.exports = router
