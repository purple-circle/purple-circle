mongoose = require('mongoose')
kue = require("kue")
jobs = kue.createQueue()

settings = require("../settings")
require("../mongo")(settings)

jobs.process "api.getUserlist", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .find()
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error


jobs.process "api.getUser", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .findOne()
    .where('_id')
    .equals(job.data._id)
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


jobs.process "api.saveFacebookData", (job, done) ->
  Facebook = mongoose.model 'facebook_user_data'
  facebook = new Facebook(job.data)
  facebook.save (err) ->
    if err
      done(err)
    else
      done null, facebook


jobs.process "api.createGroup", (job, done) ->
  Groups = mongoose.model 'groups'
  group = new Groups(job.data)
  group.save (err) ->
    if err
      done(err)
    else
      done null, group


jobs.process "api.getGroups", (job, done) ->
  Groups = mongoose.model 'groups'
  Groups
    .find()
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

