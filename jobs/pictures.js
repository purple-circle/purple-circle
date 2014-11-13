(function() {
  var jobs, kue, mongoose, settings;

  mongoose = require('mongoose');

  kue = require("kue");

  jobs = kue.createQueue();

  settings = require("../settings");

  require("../mongo")(settings);

  console.log("picture worker running");

  jobs.process("processGroupPicture", function(job, done) {
    var Pictures;
    Pictures = mongoose.model('group_pictures');
    return Pictures.find({
      _id: job.data._id
    }).exec().then(function(result) {
      console.log("result", result);
      return done(null, result);
    });
  });

}).call(this);
