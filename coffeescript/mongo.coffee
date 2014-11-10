module.exports = (settings) ->
  mongoose = require('mongoose')
  passportLocalMongoose = require('passport-local-mongoose')

  getRandomName = ->
     num = Math.ceil(Math.random() * 1000)
     "Anonymous Monkeyhandler #{num}"

  userSchema = mongoose.Schema {
    name: { type: String, trim: true, default: getRandomName }
    username: { type: String, lowercase: true, trim: true }
    email: { type: String, lowercase: true, trim: true }
    password: 'String'
    gender: 'String'
    bio: 'String'
    birthday: 'Date'
    facebook_id: 'String'
    created: { type: Date, default: Date.now }
    hidden: { type: Boolean, default: false }
    random: {type: [Number], index: '2d', default: -> return [Math.random(), Math.random()]}
  }

  facebookUserSchema = mongoose.Schema {
    id: 'String'
    user_id: 'String'
    name: 'String'
    first_name: 'String'
    middle_name: 'String'
    last_name: 'String'
    username: { type: String, lowercase: true, trim: true }
    url: 'String'
    gender: 'String'
    email: 'String'
    emails: { type: Array }
    quotes: 'String'
    bio: 'String'
    birthday: 'Date'
    locale: 'String'
    timezone: 'String'
    verified: 'String'
    metadata: 'Object'

    created: { type: Date, default: Date.now }
  }

  groupSchema = mongoose.Schema {
    name: 'String'
    description: 'String'
    category: 'String'
    created_by: 'String'
    edited_by: 'String'
    private: { type: Boolean, default: false }
    created_at: { type: Date, default: Date.now }
    edited_at: { type: Date, default: Date.now }
  }


  userSchema.plugin(passportLocalMongoose)

  mongoose.model 'users', userSchema
  mongoose.model 'groups', groupSchema
  mongoose.model 'facebook_user_data', facebookUserSchema

  db = mongoose.connection

  db.on 'error', (error) ->
    console.log 'Mongodb returned error: %s', error

  db.on 'disconnected', ->
    console.log 'Mongodb connection disconnected'

  mongoose.connect 'localhost', settings.db
