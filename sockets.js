(function() {
  module.exports = function(server, sessionStore) {
    var Q, api, chat, groups, io, user;
    io = require("socket.io").listen(server);
    api = require("./models/api");
    groups = require("./models/groups");
    user = require("./models/user");
    chat = require("./models/chat");
    Q = require("q");
    io.use(function(socket, next) {
      return sessionStore(socket.request, socket.request.res, next);
    });
    return io.on("connection", function(socket) {
      socket.on("getuser", function(data) {
        return api.getUser(data).then(function(user) {
          var loggedin_user, _ref, _ref1, _ref2;
          loggedin_user = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
          user.my_profile = loggedin_user === user._id;
          return socket.emit("user", user);
        });
      });
      socket.on("edit_user", function(_arg) {
        var data, id, loggedin_user, userid, _ref, _ref1, _ref2;
        id = _arg.id, data = _arg.data;
        userid = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        loggedin_user = userid != null;
        if (!loggedin_user) {
          return;
        }
        delete data._id;
        return user.edit(id, data).then(function(result) {
          return socket.emit("edit_user", result);
        });
      });
      socket.on("getuserlist", function(data) {
        return api.getUserlist().then(function(data) {
          return socket.emit("userlist", data);
        });
      });
      socket.on("checkLogin", function(data) {
        var loggedin_user, _ref, _ref1, _ref2;
        loggedin_user = ((_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0) != null;
        return socket.emit("checkLogin", loggedin_user);
      });
      socket.on("getLoggedinUser", function() {
        var loggedin_user, _ref, _ref1, _ref2;
        loggedin_user = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        if (!loggedin_user) {
          return false;
        }
        return api.getUser(loggedin_user).then(function(user) {
          return socket.emit("getLoggedinUser", user);
        });
      });
      socket.on("getGroup", function(id) {
        return groups.getGroup(id).then(function(group) {
          return socket.emit("getGroup", group);
        });
      });
      socket.on("joinGroup", function(id) {
        var data, loggedin_user, _ref, _ref1, _ref2;
        loggedin_user = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        if (!loggedin_user) {
          return false;
        }
        data = {
          group_id: id,
          user_id: loggedin_user
        };
        return groups.joinGroup(data).then(function(result) {
          return socket.emit("joinGroup", result);
        });
      });
      socket.on("checkMembership", function(id) {
        var data, loggedin_user, _ref, _ref1, _ref2;
        loggedin_user = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        if (!loggedin_user) {
          socket.emit("checkMembership", false);
          return false;
        }
        data = {
          group_id: id,
          user_id: loggedin_user
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
        var loggedin_user, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        loggedin_user = ((_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0) != null;
        if (!data.name) {
          return;
        }
        if (!loggedin_user) {
          return;
        }
        data.created_by = (_ref3 = socket.request) != null ? (_ref4 = _ref3.session) != null ? (_ref5 = _ref4.passport) != null ? _ref5.user : void 0 : void 0 : void 0;
        return groups.create(data).then(function(result) {
          socket.emit("createGroup", result);
          return socket.broadcast.emit("createGroup", result);
        });
      });
      socket.on("editGroup", function(_arg) {
        var data, id, loggedin_user, userid, _ref, _ref1, _ref2;
        id = _arg.id, data = _arg.data;
        userid = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        loggedin_user = userid != null;
        if (!data.name) {
          return;
        }
        if (!loggedin_user) {
          return;
        }
        data.edited_by = userid;
        delete data._id;
        return groups.update(id, data).then(function(result) {
          return socket.emit("editGroup", result);
        });
      });
      socket.on("load_chat_messages", function(_arg) {
        var action, target;
        action = _arg.action, target = _arg.target;
        return chat.load_messages(action, target).then(function(result) {
          return socket.emit("load_chat_messages", result);
        });
      });
      return socket.on("save_chat_message", function(data) {
        var loggedin_user, _ref, _ref1, _ref2, _ref3, _ref4, _ref5;
        loggedin_user = ((_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0) != null;
        if (!data.target || !data.action) {
          return;
        }
        if (!loggedin_user) {
          return;
        }
        data.user_id = (_ref3 = socket.request) != null ? (_ref4 = _ref3.session) != null ? (_ref5 = _ref4.passport) != null ? _ref5.user : void 0 : void 0 : void 0;
        return chat.save(data).then(function(result) {
          socket.emit("save_chat_message", result);
          return socket.broadcast.emit("save_chat_message", result);
        });
      });
    });
  };

}).call(this);
