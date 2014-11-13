(function() {
  module.exports = function(server, sessionStore) {
    var Q, api, groups, io;
    io = require("socket.io").listen(server);
    api = require("./models/api");
    groups = require("./models/groups");
    Q = require("q");
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
      socket.on("getLoggedinUser", function() {
        var loggedinUser, _ref, _ref1, _ref2;
        loggedinUser = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        if (!loggedinUser) {
          return false;
        }
        return api.getUser(loggedinUser).then(function(user) {
          return socket.emit("getLoggedinUser", user);
        });
      });
      socket.on("getGroup", function(id) {
        return groups.getGroup(id).then(function(group) {
          return socket.emit("getGroup", group);
        });
      });
      socket.on("joinGroup", function(id) {
        var data, loggedinUser, _ref, _ref1, _ref2;
        loggedinUser = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        if (!loggedinUser) {
          return false;
        }
        data = {
          group_id: id,
          user_id: loggedinUser
        };
        return groups.joinGroup(data).then(function(result) {
          return socket.emit("joinGroup", result);
        });
      });
      socket.on("checkMembership", function(id) {
        var data, loggedinUser, _ref, _ref1, _ref2;
        loggedinUser = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        if (!loggedinUser) {
          socket.emit("checkMembership", false);
          return false;
        }
        data = {
          group_id: id,
          user_id: loggedinUser
        };
        return groups.checkMembership(data).then(function(membership) {
          return socket.emit("checkMembership", membership);
        });
      });
      socket.on("getMemberList", function(id) {
        return groups.getMemberList(id).then(function(members) {
          var list, member, _i, _len;
          list = [];
          for (_i = 0, _len = members.length; _i < _len; _i++) {
            member = members[_i];
            list.push(api.getUser(member.user_id));
          }
          return Q.all(list).then(function(users) {
            return socket.emit("getMemberList", users);
          });
        });
      });
      socket.on("getGroupList", function(data) {
        return groups.getGroups(data).then(function(result) {
          return socket.emit("getGroupList", result);
        });
      });
      socket.on("getGroupPictures", function(id) {
        return groups.getPictures(id).then(function(result) {
          return socket.emit("getGroupPictures", result);
        });
      });
      socket.on("createGroup", function(data) {
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
      return socket.on("editGroup", function(_arg) {
        var data, id, loggedinUser, userid, _ref, _ref1, _ref2;
        id = _arg.id, data = _arg.data;
        userid = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        loggedinUser = userid != null;
        if (!data.name) {
          return;
        }
        if (!loggedinUser) {
          return;
        }
        data.edited_by = userid;
        delete data._id;
        return groups.update(id, data).then(function(result) {
          return socket.emit("editGroup", result);
        });
      });
    });
  };

}).call(this);
