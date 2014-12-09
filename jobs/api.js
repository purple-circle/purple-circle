(function() {
  var jobs, kue, mongoose, selectUserFields, settings;

  mongoose = require('mongoose');

  kue = require("kue");

  jobs = kue.createQueue();

  settings = require("../settings");

  require("../mongo")(settings);

  console.log("api worker running");

  selectUserFields = '-salt -hash';

  jobs.process("api.getUserlist", function(job, done) {
    var Users;
    Users = mongoose.model('users');
    return Users.find().select(selectUserFields).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.getUser", function(job, done) {
    var Users;
    Users = mongoose.model('users');
    return Users.findOne(job.data).select(selectUserFields).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.edit_user", function(job, done) {
    var User, data, id, _ref;
    User = mongoose.model('users');
    _ref = job.data, id = _ref.id, data = _ref.data;
    return User.findByIdAndUpdate(id, {
      $set: data
    }, function(err, user) {
      if (err) {
        handleError(err);
        return done(err);
      } else {
        return done(null, user);
      }
    });
  });

  jobs.process("api.createUser", function(job, done) {
    var User, user;
    User = mongoose.model('users');
    user = new User(job.data);
    return user.save(function(err) {
      if (err) {
        return done(err);
      } else {
        return done(null, user);
      }
    });
  });

  jobs.process("api.localSignupUser", function(job, done) {
    var User;
    User = mongoose.model('users');
    return User.register(new User({
      username: job.data.username
    }), job.data.password, function(err, account) {
      if (err) {
        return done(err);
      } else {
        return done(null, account);
      }
    });
  });

  jobs.process("api.getProfilePictures", function(job, done) {
    var Pictures;
    Pictures = mongoose.model('profile_pictures');
    return Pictures.find({
      user_id: job.data
    }).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.saveProfilePicture", function(job, done) {
    var Pictures, data, picture;
    Pictures = mongoose.model('profile_pictures');
    data = job.data.data;
    picture = new Pictures(data);
    return picture.save(function(err) {
      if (err) {
        return done(err);
      } else {
        done(null, picture);
        return jobs.create('processProfilePicture', picture).save();
      }
    });
  });

  jobs.process("api.saveFacebookData", function(job, done) {
    var Facebook, facebook;
    Facebook = mongoose.model('facebook_user_data');
    facebook = new Facebook(job.data);
    return facebook.save(function(err) {
      if (err) {
        return done(err);
      } else {
        return done(null, facebook);
      }
    });
  });

  jobs.process("api.saveGoogleData", function(job, done) {
    var Google, google;
    Google = mongoose.model('google_user_data');
    google = new Google(job.data);
    return google.save(function(err) {
      if (err) {
        return done(err);
      } else {
        return done(null, google);
      }
    });
  });

  jobs.process("api.saveInstagramData", function(job, done) {
    var Instagram, instagram;
    Instagram = mongoose.model('instagram_user_data');
    instagram = new Instagram(job.data);
    return instagram.save(function(err) {
      if (err) {
        return done(err);
      } else {
        return done(null, instagram);
      }
    });
  });

  jobs.process("api.createGroup", function(job, done) {
    var Groups, group;
    Groups = mongoose.model('groups');
    group = new Groups(job.data);
    return group.save(function(err) {
      if (err) {
        return done(err);
      } else {
        return done(null, group);
      }
    });
  });

  jobs.process("api.joinGroup", function(job, done) {
    var GroupMembers, member;
    GroupMembers = mongoose.model('group_members');
    member = new GroupMembers(job.data);
    return member.save(function(err) {
      if (err) {
        return done(err);
      } else {
        return done(null, member);
      }
    });
  });

  jobs.process("api.createGroupPictureAlbum", function(job, done) {
    var GroupPictureAlbum, album;
    GroupPictureAlbum = mongoose.model('group_picture_albums');
    album = new GroupPictureAlbum(job.data);
    return album.save(function(err) {
      if (err) {
        return done(err);
      } else {
        return done(null, album);
      }
    });
  });

  jobs.process("api.leaveGroup", function(job, done) {
    var GroupMembers;
    GroupMembers = mongoose.model('group_members');
    return GroupMembers.remove(job.data).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.checkMembership", function(job, done) {
    var Members;
    Members = mongoose.model('group_members');
    return Members.findOne(job.data).exec().then(function(result) {
      var membership;
      membership = result !== null;
      return done(null, membership);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.getMemberList", function(job, done) {
    var Members;
    Members = mongoose.model('group_members');
    return Members.find({
      group_id: job.data
    }).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.getGroupPictureAlbums", function(job, done) {
    var Albums;
    Albums = mongoose.model('group_picture_albums');
    return Albums.find({
      group_id: job.data
    }).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.getGroupPictures", function(job, done) {
    var Pictures;
    Pictures = mongoose.model('group_pictures');
    return Pictures.find({
      group_id: job.data
    }).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.saveGroupPicture", function(job, done) {
    var Pictures, data, picture;
    Pictures = mongoose.model('group_pictures');
    data = job.data.data;
    picture = new Pictures(data);
    return picture.save(function(err) {
      if (err) {
        return done(err);
      } else {
        done(null, picture);
        return jobs.create('processGroupPicture', picture).save();
      }
    });
  });

  jobs.process("api.editGroup", function(job, done) {
    var Groups, data, id, _ref;
    Groups = mongoose.model('groups');
    _ref = job.data, id = _ref.id, data = _ref.data;
    return Groups.findByIdAndUpdate(id, data, function(err, group) {
      if (err) {
        handleError(err);
        return done(err);
      } else {
        return done(null, group);
      }
    });
  });

  jobs.process("api.getGroups", function(job, done) {
    var Groups, filters;
    filters = {};
    if (job.data.category) {
      filters.category = job.data.category;
    }
    Groups = mongoose.model('groups');
    return Groups.find(filters).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.getGroup", function(job, done) {
    var Groups;
    Groups = mongoose.model('groups');
    return Groups.findOne().where('_id').equals(job.data).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.load_chat_messages", function(job, done) {
    var ChatMessages;
    ChatMessages = mongoose.model('chat_messages');
    return ChatMessages.find(job.data).exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.save_chat_message", function(job, done) {
    var ChatMessages, hashtags, message, options, twitter, user_mentions;
    twitter = require('twitter-text');
    user_mentions = twitter.extractMentions(job.data.message);
    hashtags = twitter.extractHashtags(job.data.message);
    job.data.original_message = job.data.message;
    options = {
      usernameUrlBase: "/profile/",
      hashtagUrlBase: "/tag/"
    };
    job.data.message = twitter.autoLink(twitter.htmlEscape(job.data.message), options);
    if (user_mentions || hashtags) {
      job.data.metadata = {};
    }
    if (user_mentions.length) {
      job.data.metadata.user_mentions = user_mentions;
    }
    if (hashtags.length) {
      job.data.metadata.hashtags = hashtags;
    }
    ChatMessages = mongoose.model('chat_messages');
    message = new ChatMessages(job.data);
    return message.save(function(err) {
      if (err) {
        return done(err);
      } else {
        return done(null, message);
      }
    });
  });

}).call(this);
