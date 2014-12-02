Q = require("q")
api = require("../models/api")
chat = {}

chat.save = (data) ->
  api.createQueue("api.save_chat_message", data)

chat.load_messages = (action, target) ->
  api.createQueue("api.load_chat_messages", {action, target})

module.exports = chat