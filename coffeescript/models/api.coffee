Q = require("q")
kue = require("kue")
api = {}

api.createQueue = (name, data) ->
  deferred = Q.defer()
  jobs = kue.createQueue()
  job = jobs
    .create(name, data)
    .save()
  job
    .on("complete", deferred.resolve)
    .on("failed", deferred.reject)

  jobs
    .create('stats.save_api_log', name)
    .save()

  deferred.promise

# TODO: these are in wrong place
api.getUserlist = ->
  api.createQueue("api.getUserlist")

api.getUser = (id) ->
  api.createQueue("api.getUser", {_id: id})

api.getUserByFilters = (filters) ->
  api.createQueue("api.getUser", filters)


module.exports = api