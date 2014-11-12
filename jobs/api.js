(function() {
  var jobs, kue, mongoose, settings;

  mongoose = require('mongoose');

  kue = require("kue");

  jobs = kue.createQueue();

  settings = require("../settings");

  require("../mongo")(settings);

  console.log("api worker running");

  jobs.process("api.getUserlist", function(job, done) {
    var Users;
    Users = mongoose.model('users');
    return Users.find().select('name username created birthday').exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.getUser", function(job, done) {
    var Users;
    Users = mongoose.model('users');
    return Users.findOne(job.data).select('name username created birthday').exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
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

}).call(this);
