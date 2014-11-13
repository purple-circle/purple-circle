mongoose = require('mongoose')
kue = require("kue")
jobs = kue.createQueue()

settings = require("../settings")
require("../mongo")(settings)

console.log "picture worker running"


jobs.process "processGroupPicture", (job, done) ->
  Pictures = mongoose.model 'group_pictures'
  Pictures
    .find({_id: job.data._id})
    .exec()
    .then (result) ->
      # TODO: resize images etc
      console.log "result", result
      done null, result
