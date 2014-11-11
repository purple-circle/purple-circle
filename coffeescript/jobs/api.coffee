mongoose = require('mongoose')
kue = require("kue")
jobs = kue.createQueue()

settings = require("../settings")
require("../mongo")(settings)

console.log "api worker running"

jobs.process "api.getUserlist", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .find()
    .select('-hash -salt')
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error


jobs.process "api.getUser", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .findOne(job.data)
    .select('-hash -salt')
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error


jobs.process "api.createUser", (job, done) ->
  User = mongoose.model 'users'
  user = new User(job.data)
  user.save (err) ->
    if err
      done(err)
    else
      done null, user


jobs.process "api.localSignupUser", (job, done) ->
  User = mongoose.model 'users'
  User.register new User(username: job.data.username), job.data.password, (err, account) ->
    if err
      done err
    else
      done null, account


jobs.process "api.saveFacebookData", (job, done) ->
  Facebook = mongoose.model 'facebook_user_data'
  facebook = new Facebook(job.data)
  facebook.save (err) ->
    if err
      done(err)
    else
      done null, facebook


jobs.process "api.saveGoogleData", (job, done) ->
  Google = mongoose.model 'google_user_data'
  google = new Google(job.data)
  google.save (err) ->
    if err
      done(err)
    else
      done null, google

jobs.process "api.saveInstagramData", (job, done) ->
  Instagram = mongoose.model 'instagram_user_data'
  instagram = new Instagram(job.data)
  instagram.save (err) ->
    if err
      done(err)
    else
      done null, instagram


jobs.process "api.createGroup", (job, done) ->
  Groups = mongoose.model 'groups'
  group = new Groups(job.data)
  group.save (err) ->
    if err
      done(err)
    else
      done null, group


jobs.process "api.editGroup", (job, done) ->
  Groups = mongoose.model 'groups'

  {id, data} = job.data

  Groups
    .findByIdAndUpdate id, data, (err, group) ->
      if err
        handleError(err)
        done(err)
      else
        done null, group


jobs.process "api.getGroups", (job, done) ->
  filters = {}

  if job.data.category
    filters.category = job.data.category

  Groups = mongoose.model 'groups'
  Groups
    .find(filters)
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error


jobs.process "api.getGroup", (job, done) ->
  Groups = mongoose.model 'groups'
  Groups
    .findOne()
    .where('_id')
    .equals(job.data)
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error

