"use strict"
express = require("express")
passport = require("passport")
FacebookStrategy = require('passport-facebook').Strategy
mongoose = require('mongoose')
router = express.Router()

UserApi = require("../models/user")
FacebookModel = require("../models/facebook")


# Redirect the user to Facebook for authentication.  When complete,
# Facebook will redirect the user back to the application at
#     /auth/facebook/callback
router.get "/", passport.authenticate("facebook", { scope: ['email', 'user_birthday'] })


# Facebook will redirect the user to this URL after approval.  Finish the
# authentication process by attempting to obtain an access token.  If
# access was granted, the user will be logged in.  Otherwise,
# authentication has failed.
router.get "/callback", passport.authenticate "facebook",
  successRedirect: "/login/success"
  failureRedirect: "/login/fail"

facebook_options =
  api: "dev"
  options:
    production:
      clientID: ""
      clientSecret: ""
      callbackURL: ""
    dev:
      clientID: 1508640816070423
      clientSecret: "5343aa8abe52ebf19782922e2a7255dd"
      callbackURL: "http://localhost:3000/auth/facebook/callback"


facebookOptions = facebook_options.options[facebook_options.api]
passport.use new FacebookStrategy facebookOptions, (accessToken, refreshToken, profile, done) ->
  Users = mongoose.model 'users'
  Users
    .findOne({facebook_id: profile.id})
    .exec (err, data) ->

      if err
        done(err)
      else if data
        done null, data

      else

        #console.log "profile", profile

        userData =
          facebook_id: profile.id
          name: profile.displayName
          gender: profile.gender
          email: profile._json.email
          birthday: profile._json.birthday
          username: profile.displayName.replace(" ", ".") + Math.ceil(Math.random() * 1000)
          # Username hack for now

        facebook_profile =
          id: profile.id
          name: profile.displayName
          url: profile.profileUrl
          first_name: profile._json.first_name
          middle_name: profile.name.middleName
          last_name: profile._json.last_name
          gender: profile.gender
          email: profile._json.email
          emails: profile.emails
          birthday: profile._json.birthday
          locale: profile._json.locale
          timezone: profile._json.timezone
          verified: profile._json.verified
          metadata: profile
          accessToken: accessToken

        UserApi
          .create(userData)
          .then (result) ->

            facebook_profile.user_id = result._id
            FacebookModel.save(facebook_profile)

            done null, result
          , (error) ->
            done error



module.exports = router