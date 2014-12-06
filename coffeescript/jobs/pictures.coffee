mongoose = require('mongoose')
kue = require("kue")
jobs = kue.createQueue()

gm = require('gm')

settings = require("../settings")
require("../mongo")(settings)

console.log "picture worker running"


jobs.process "processGroupPicture", (job, done) ->
  Pictures = mongoose.model 'group_pictures'
  id = job.data._id
  Pictures
    .findOne({_id: id})
    .exec()
    .then (result) ->
      # TODO: resize images etc
      if !result
        return false

      gm(result.file.path)
        .options({imageMagick: true})
        .identify (err, metadata) ->
          if err
            return false

          result.metadata = metadata
          result.resolution = metadata.size
          result.save()

          done null, result

jobs.process "processProfilePicture", (job, done) ->
  Pictures = mongoose.model 'profile_pictures'
  id = job.data._id
  Pictures
    .findOne({_id: id})
    .exec()
    .then (result) ->
      # TODO: resize images etc
      if !result
        return false

      gm(result.file.path)
        .options({imageMagick: true})
        .identify (err, metadata) ->
          if err
            return false

          result.metadata = metadata
          result.resolution = metadata.size
          result.save()

          done null, result
