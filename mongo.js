(function() {
  module.exports = function(settings) {
    var db, facebookUserSchema, getRandomName, groupSchema, mongoose, passportLocalMongoose, userSchema;
    mongoose = require('mongoose');
    passportLocalMongoose = require('passport-local-mongoose');
    getRandomName = function() {
      var num;
      num = Math.ceil(Math.random() * 1000);
      return "Anonymous Monkeyhandler " + num;
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
        trim: true
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
      facebook_id: 'Number',
      created: {
        type: Date,
        "default": Date.now
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
      id: 'Number',
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
      "private": {
        type: Boolean,
        "default": false
      },
      created: {
        type: Date,
        "default": Date.now
      }
    });
    userSchema.plugin(passportLocalMongoose);
    mongoose.model('users', userSchema);
    mongoose.model('groups', groupSchema);
    mongoose.model('facebook_user_data', facebookUserSchema);
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
