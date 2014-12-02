(function() {
  var Q, api, chat;

  Q = require("q");

  api = require("../models/api");

  chat = {};

  chat.save = function(data) {
    return api.createQueue("api.save_chat_message", data);
  };

  chat.load_messages = function(action, target) {
    return api.createQueue("api.load_chat_messages", {
      action: action,
      target: target
    });
  };

  module.exports = chat;

}).call(this);
