mongoose = require('mongoose')
kue = require("kue")
jobs = kue.createQueue()

settings = require("../settings")
require("../mongo")(settings)

console.log "api worker running"
selectUserFields = '-salt -hash'

jobs.process "api.getUserlist", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .find()
    .select(selectUserFields)
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error


jobs.process "api.getUser", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .findOne(job.data)
    .select(selectUserFields)
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error


jobs.process "api.edit_user", (job, done) ->
  User = mongoose.model 'users'

  {id, data} = job.data

  User
    .findByIdAndUpdate id, {$set: data}, (err, user) ->
      if err
        handleError(err)
        done(err)
      else
        done null, user


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

jobs.process "api.joinGroup", (job, done) ->
  GroupMembers = mongoose.model 'group_members'
  member = new GroupMembers(job.data)
  member.save (err) ->
    if err
      done(err)
    else
      done null, member


jobs.process "api.checkMembership", (job, done) ->
  Members = mongoose.model 'group_members'
  Members
    .findOne(job.data)
    .exec()
    .then (result) ->
      membership = result isnt null
      done(null, membership)
    , (error) ->
      done error

jobs.process "api.getMemberList", (job, done) ->
  Members = mongoose.model 'group_members'
  Members
    .find({group_id: job.data})
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error

jobs.process "api.getPictures", (job, done) ->
  Pictures = mongoose.model 'group_pictures'
  Pictures
    .find({group_id: job.data})
    .exec()
    .then (result) ->
      done(null, result)
    , (error) ->
      done error

jobs.process "api.saveGroupPicture", (job, done) ->
  Pictures = mongoose.model 'group_pictures'

  {data} = job.data

  picture = new Pictures(data)
  picture.save (err) ->
    if err
      done(err)
    else
      done null, picture

      jobs
        .create('processGroupPicture', picture)
        .save()



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

