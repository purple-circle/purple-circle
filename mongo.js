(function() {
  module.exports = function(settings) {
    var chatMessageSchema, db, facebookUserSchema, getRandomName, getRandomUserName, googleUserSchema, groupMemberSchema, groupPictureSchema, groupSchema, instagramUserSchema, mongoose, passportLocalMongoose, profilePictureSchema, userSchema;
    mongoose = require('mongoose');
    passportLocalMongoose = require('passport-local-mongoose');
    getRandomName = function() {
      var num;
      num = Math.ceil(Math.random() * 1000);
      return "Anonymous Monkeyhandler " + num;
    };
    getRandomUserName = function() {
      var num;
      num = Math.ceil(Math.random() * 1000);
      return "anonymous.manbearpig." + num;
    };
    userSchema = mongoose.Schema({
      name: {
        type: String,
        trim: true,
        "default": getRandomName
      },
      username: {
        type: String,
        lowercase: true,
        trim: true,
        "default": getRandomUserName
      },
      email: {
        type: String,
        lowercase: true,
        trim: true
      },
      password: 'String',
      gender: 'String',
      bio: 'String',
      birthday: 'Date',
      facebook_id: 'String',
      google_id: 'String',
      instagram_id: 'String',
      created: {
        type: Date,
        "default": Date.now
      },
      show_birthday: {
        type: Boolean,
        "default": true
      },
      show_bio: {
        type: Boolean,
        "default": true
      },
      hidden: {
        type: Boolean,
        "default": false
      },
      random: {
        type: [Number],
        index: '2d',
        "default": function() {
          return [Math.random(), Math.random()];
        }
      }
    });
    facebookUserSchema = mongoose.Schema({
      id: 'String',
      user_id: 'String',
      name: 'String',
      first_name: 'String',
      middle_name: 'String',
      last_name: 'String',
      username: {
        type: String,
        lowercase: true,
        trim: true
      },
      url: 'String',
      gender: 'String',
      email: 'String',
      emails: {
        type: Array
      },
      quotes: 'String',
      bio: 'String',
      birthday: 'Date',
      locale: 'String',
      timezone: 'String',
      verified: 'String',
      metadata: 'Object',
      accessToken: 'String',
      created: {
        type: Date,
        "default": Date.now
      }
    });
    googleUserSchema = mongoose.Schema({
      id: 'String',
      user_id: 'String',
      name: 'String',
      first_name: 'String',
      last_name: 'String',
      emails: {
        type: Array
      },
      metadata: 'Object',
      identifier: 'String',
      created: {
        type: Date,
        "default": Date.now
      }
    });
    instagramUserSchema = mongoose.Schema({
      id: 'String',
      user_id: 'String',
      name: 'String',
      first_name: 'String',
      last_name: 'String',
      bio: 'String',
      website: 'String',
      profile_picture: 'String',
      metadata: 'Object',
      accessToken: 'String',
      created: {
        type: Date,
        "default": Date.now
      }
    });
    groupSchema = mongoose.Schema({
      name: 'String',
      description: 'String',
      category: 'String',
      created_by: 'String',
      edited_by: 'String',
      "private": {
        type: Boolean,
        "default": false
      },
      created_at: {
        type: Date,
        "default": Date.now
      },
      edited_at: {
        type: Date,
        "default": Date.now
      }
    });
    groupMemberSchema = mongoose.Schema({
      group_id: 'ObjectId',
      user_id: 'ObjectId',
      created_at: {
        type: Date,
        "default": Date.now
      }
    });
    groupPictureSchema = mongoose.Schema({
      group_id: 'ObjectId',
      user_id: 'ObjectId',
      title: 'String',
      filename: 'String',
      file: 'Object',
      resolution: 'Object',
      metadata: 'Object',
      created_at: {
        type: Date,
        "default": Date.now
      }
    });
    profilePictureSchema = mongoose.Schema({
      user_id: 'ObjectId',
      title: 'String',
      filename: 'String',
      file: 'Object',
      resolution: 'Object',
      metadata: 'Object',
      created_at: {
        type: Date,
        "default": Date.now
      }
    });
    chatMessageSchema = mongoose.Schema({
      target: 'ObjectId',
      action: 'String',
      user_id: 'ObjectId',
      message: 'String',
      metadata: 'Object',
      created_at: {
        type: Date,
        "default": Date.now
      }
    });
    userSchema.plugin(passportLocalMongoose);
    mongoose.model('users', userSchema);
    mongoose.model('groups', groupSchema);
    mongoose.model('group_members', groupMemberSchema);
    mongoose.model('group_pictures', groupPictureSchema);
    mongoose.model('profile_pictures', profilePictureSchema);
    mongoose.model('facebook_user_data', facebookUserSchema);
    mongoose.model('instagram_user_data', instagramUserSchema);
    mongoose.model('google_user_data', googleUserSchema);
    mongoose.model('chat_messages', chatMessageSchema);
    db = mongoose.connection;
    db.on('error', function(error) {
      return console.log('Mongodb returned error: %s', error);
    });
    db.on('disconnected', function() {
      return console.log('Mongodb connection disconnected');
    });
    return mongoose.connect('localhost', settings.db);
  };

}).call(this);
