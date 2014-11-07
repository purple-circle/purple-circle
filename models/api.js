(function() {
  var Q, api, kue;

  Q = require("q");

  kue = require("kue");

  api = {};

  api.createQueue = function(name, data) {
    var deferred, job, jobs;
    deferred = Q.defer();
    jobs = kue.createQueue();
    job = jobs.create(name, data).save();
    job.on("complete", deferred.resolve).on("failed", deferred.reject);
    return deferred.promise;
  };

  api.getUserlist = function() {
    return api.createQueue("api.getUserlist");
  };

  api.getUser = function(id) {
    return api.createQueue("api.getUser", {
      _id: id
    });
  };

  module.exports = api;

}).call(this);
