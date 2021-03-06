mongoose = require('mongoose')
kue = require("kue")
jobs = kue.createQueue()

settings = require("../settings")
require("../mongo")(settings)

twitter = require('twitter-text')

twitter_text_options =
  usernameUrlBase: "/profile/"
  hashtagUrlBase: "/tag/"

console.log "api worker running"
selectUserFields = '-salt -hash'


jobs.process "stats.save_api_log", (job, done) ->
  Log = mongoose.model 'api_logs'

  data =
    name: job.data

  log = new Log(data)
  log.save (err) ->
    if err
      done(err)
    else
      done null, log

jobs.process "api.api_stats", (job, done) ->
  Log = mongoose.model 'api_logs'
  Log
    .find()
    .exec()
    .then (result) ->
      done(null, result)
    , done


jobs.process "api.getUserlist", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .find()
    .select(selectUserFields)
    .exec()
    .then (result) ->
      done(null, result)
    , done


jobs.process "api.getUser", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .findOne(job.data)
    .select(selectUserFields)
    .exec()
    .then (result) ->
      done(null, result)
    , done


jobs.process "api.check_username", (job, done) ->
  Users = mongoose.model 'users'
  Users
    .findOne({username: job.data})
    .select('username')
    .exec()
    .then (result) ->
      done(null, result)
    , done


jobs.process "api.check_group_name", (job, done) ->
  Groups = mongoose.model 'groups'
  Groups
    .findOne({name: job.data})
    .select('name')
    .exec()
    .then (result) ->
      done(null, result)
    , done


jobs.process "api.edit_user", (job, done) ->
  User = mongoose.model 'users'

  {id, data} = job.data

  if data.bio
    user_mentions = twitter.extractMentions(data.bio)
    hashtags = twitter.extractHashtags(data.bio)

    data.original_bio = data.bio

    data.bio = twitter.autoLink(twitter.htmlEscape(data.bio), twitter_text_options)

    if user_mentions || hashtags
      data.metadata = {}

    if user_mentions.length
      data.metadata.user_mentions = user_mentions

    if hashtags.length
      data.metadata.hashtags = hashtags

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

jobs.process "api.getProfilePictures", (job, done) ->
  Pictures = mongoose.model 'profile_pictures'
  Pictures
    .find({user_id: job.data})
    .exec()
    .then (result) ->
      done(null, result)
    , done

jobs.process "api.saveProfilePicture", (job, done) ->
  Pictures = mongoose.model 'profile_pictures'

  {data} = job.data

  picture = new Pictures(data)
  picture.save (err) ->
    if err
      done(err)
    else
      done null, picture

      if data.default_picture
        user_data =
          picture_url: "/uploads/#{picture.filename}"

        jobs
          .create('api.edit_user', {id: data.user_id, data: user_data})
          .save()

      jobs
        .create('processProfilePicture', picture)
        .save()


jobs.process "api.get_profile_picture", (job, done) ->
  Pictures = mongoose.model 'profile_pictures'
  id = job.data.picture_id
  user_id = job.data.user_id
  Pictures
    .findOne({_id: id, user_id})
    .exec()
    .then (result) ->
      done(null, result)
    , done

jobs.process "api.create_profile_picture_album", (job, done) ->
  ProfilePictureAlbum = mongoose.model 'profile_picture_albums'
  album = new ProfilePictureAlbum(job.data)
  album.save (err) ->
    if err
      done(err)
    else
      done null, album

jobs.process "api.get_profile_picture_albums", (job, done) ->
  Albums = mongoose.model 'profile_picture_albums'
  Albums
    .find({user_id: job.data})
    .exec()
    .then (result) ->
      done(null, result)
    , done


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

  if job.data.description
    user_mentions = twitter.extractMentions(job.data.description)
    hashtags = twitter.extractHashtags(job.data.description)

    job.data.original_description = job.data.description

    job.data.description = twitter.autoLink(twitter.htmlEscape(job.data.description), twitter_text_options)

    if user_mentions || hashtags
      job.data.metadata = {}

    if user_mentions.length
      job.data.metadata.user_mentions = user_mentions

    if hashtags.length
      job.data.metadata.hashtags = hashtags

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

jobs.process "api.createGroupPictureAlbum", (job, done) ->
  GroupPictureAlbum = mongoose.model 'group_picture_albums'
  album = new GroupPictureAlbum(job.data)
  album.save (err) ->
    if err
      done(err)
    else
      done null, album


jobs.process "api.leaveGroup", (job, done) ->
  GroupMembers = mongoose.model 'group_members'

  GroupMembers
    .remove(job.data)
    .exec()
    .then (result) ->
      done(null, result)
    , done


jobs.process "api.get_group_picture", (job, done) ->
  Pictures = mongoose.model 'group_pictures'
  id = job.data.picture_id
  group_id = job.data.group_id
  Pictures
    .findOne({_id: id, group_id})
    .exec()
    .then (result) ->
      done(null, result)
    , done


jobs.process "api.checkMembership", (job, done) ->
  Members = mongoose.model 'group_members'
  Members
    .findOne(job.data)
    .exec()
    .then (result) ->
      membership = result isnt null
      done(null, membership)
    , done

jobs.process "api.getMemberList", (job, done) ->
  Members = mongoose.model 'group_members'
  Members
    .find({group_id: job.data})
    .exec()
    .then (result) ->
      done(null, result)
    , done

jobs.process "api.getGroupPictureAlbums", (job, done) ->
  Albums = mongoose.model 'group_picture_albums'
  Albums
    .find({group_id: job.data})
    .exec()
    .then (result) ->
      done(null, result)
    , done

jobs.process "api.getGroupPictures", (job, done) ->
  Pictures = mongoose.model 'group_pictures'
  Pictures
    .find({group_id: job.data})
    .exec()
    .then (result) ->
      done(null, result)
    , done

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

  if data.description
    user_mentions = twitter.extractMentions(data.description)
    hashtags = twitter.extractHashtags(data.description)

    data.original_description = data.description

    data.description = twitter.autoLink(twitter.htmlEscape(data.description), twitter_text_options)


    if user_mentions || hashtags
      data.metadata = {}

    if user_mentions.length
      data.metadata.user_mentions = user_mentions

    if hashtags.length
      data.metadata.hashtags = hashtags

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
    , done


jobs.process "api.getGroup", (job, done) ->
  Groups = mongoose.model 'groups'
  Groups
    .findOne()
    .where('_id')
    .equals(job.data)
    .exec()
    .then (result) ->
      done(null, result)
    , done

jobs.process "api.load_chat_messages", (job, done) ->
  ChatMessages = mongoose.model 'chat_messages'
  ChatMessages
    .find(job.data)
    .exec()
    .then (result) ->
      done(null, result)
    , done

jobs.process "api.save_chat_message", (job, done) ->
  user_mentions = twitter.extractMentions(job.data.message)
  hashtags = twitter.extractHashtags(job.data.message)

  job.data.original_message = job.data.message


  job.data.message = twitter.autoLink(twitter.htmlEscape(job.data.message), twitter_text_options)


  if user_mentions || hashtags
    job.data.metadata = {}

  if user_mentions.length
    job.data.metadata.user_mentions = user_mentions

  if hashtags.length
    job.data.metadata.hashtags = hashtags

  ChatMessages = mongoose.model 'chat_messages'
  message = new ChatMessages(job.data)
  message.save (err) ->
    if err
      done(err)
    else
      done null, message



