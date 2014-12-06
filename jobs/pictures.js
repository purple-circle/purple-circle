(function() {
  var gm, jobs, kue, mongoose, settings;

  mongoose = require('mongoose');

  kue = require("kue");

  jobs = kue.createQueue();

  gm = require('gm');

  settings = require("../settings");

  require("../mongo")(settings);

  console.log("picture worker running");

  jobs.process("processGroupPicture", function(job, done) {
    var Pictures, id;
    Pictures = mongoose.model('group_pictures');
    id = job.data._id;
    return Pictures.findOne({
      _id: id
    }).exec().then(function(result) {
      if (!result) {
        return false;
      }
      return gm(result.file.path).options({
        imageMagick: true
      }).identify(function(err, metadata) {
        if (err) {
          return false;
        }
        result.metadata = metadata;
        result.resolution = metadata.size;
        result.save();
        return done(null, result);
      });
    });
  });

  jobs.process("processProfilePicture", function(job, done) {
    var Pictures, id;
    Pictures = mongoose.model('profile_pictures');
    id = job.data._id;
    return Pictures.findOne({
      _id: id
    }).exec().then(function(result) {
      if (!result) {
        return false;
      }
      return gm(result.file.path).options({
        imageMagick: true
      }).identify(function(err, metadata) {
        if (err) {
          return false;
        }
        result.metadata = metadata;
        result.resolution = metadata.size;
        result.save();
        return done(null, result);
      });
    });
  });

}).call(this);
