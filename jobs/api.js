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
    return Users.find().select('-hash -salt').exec().then(function(result) {
      return done(null, result);
    }, function(error) {
      return done(error);
    });
  });

  jobs.process("api.getUser", function(job, done) {
    var Users;
    Users = mongoose.model('users');
    return Users.findOne().where('_id').equals(job.data._id).select('-hash -salt').exec().then(function(result) {
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
