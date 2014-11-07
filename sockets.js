(function() {
  module.exports = function(server, sessionStore) {
    var api, groups, io;
    io = require("socket.io").listen(server);
    api = require("./models/api");
    groups = require("./models/groups");
    io.use(function(socket, next) {
      return sessionStore(socket.request, socket.request.res, next);
    });
    return io.on("connection", function(socket) {
      socket.on("getuser", function(data) {
        return api.getUser(data).then(function(user) {
          return socket.emit("user", user);
        });
      });
      socket.on("getuserlist", function(data) {
        return api.getUserlist().then(function(data) {
          return socket.emit("userlist", data);
        });
      });
      socket.on("checkLogin", function(data) {
        var loggedinUser, _ref, _ref1, _ref2;
        loggedinUser = ((_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0) != null;
        return socket.emit("checkLogin", loggedinUser);
      });
      socket.on("getGroup", function(id) {
        return groups.getGroup(id).then(function(group) {
          return socket.emit("getGroup", group);
        });
      });
      socket.on("getGroupList", function() {
        return groups.getGroups().then(function(result) {
          return socket.emit("getGroupList", result);
        });
      });
      return socket.on("createGroup", function(data) {
        var loggedinUser, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        loggedinUser = ((_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0) != null;
        if (!data.name) {
          return;
        }
        if (!loggedinUser) {
          return;
        }
        data.created_by = (_ref3 = socket.request) != null ? (_ref4 = _ref3.session) != null ? (_ref5 = _ref4.passport) != null ? _ref5.user : void 0 : void 0 : void 0;
        return groups.create(data).then(function(result) {
          socket.emit("createGroup", result);
          return socket.broadcast.emit("createGroup", result);
        });
      });
    });
  };

}).call(this);
