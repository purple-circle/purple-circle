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
      socket.on("getProfilePictures", function(id) {
        return user.getPictures(id).then(function(result) {
          return socket.emit("getProfilePictures", result);
        });
      });
      socket.on("get_profile_picture_albums", function(id) {
        return user.get_profile_picture_albums(id).then(function(result) {
          return socket.emit("get_profile_picture_albums", result);
        });
      });
      socket.on("set_profile_picture", function(_arg) {
        var picture_id, user_id;
        user_id = _arg.user_id, picture_id = _arg.picture_id;
        return user.set_profile_picture(user_id, picture_id).then(function(result) {
          return socket.emit("set_profile_picture", result);
        });
      });
      socket.on("set_cover_picture", function(_arg) {
        var picture_id, user_id;
        user_id = _arg.user_id, picture_id = _arg.picture_id;
        return user.set_cover_picture(user_id, picture_id).then(function(result) {
          return socket.emit("set_cover_picture", result);
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
      socket.on("get_group", function(id) {
        return groups.getGroup(id).then(function(group) {
          return socket.emit("get_group", group);
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
      socket.on("leaveGroup", function(id) {
        var data, loggedin_user, _ref, _ref1, _ref2;
        loggedin_user = (_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0;
        if (!loggedin_user) {
          return false;
        }
        data = {
          group_id: id,
          user_id: loggedin_user
        };
        return groups.leaveGroup(data).then(function(result) {
          return socket.emit("leaveGroup", result);
        });
      });
      socket.on("set_group_logo", function(_arg) {
        var group_id, picture_id;
        group_id = _arg.group_id, picture_id = _arg.picture_id;
        return groups.set_group_logo(group_id, picture_id).then(function(result) {
          return socket.emit("set_group_logo", result);
        });
      });
      socket.on("set_group_cover_picture", function(_arg) {
        var group_id, picture_id;
        group_id = _arg.group_id, picture_id = _arg.picture_id;
        return groups.set_group_cover_picture(group_id, picture_id).then(function(result) {
          return socket.emit("set_group_cover_picture", result);
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
            list.push(user.getUser(member.user_id));
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
      socket.on("getGroupPictureAlbums", function(id) {
        return groups.getPictureAlbums(id).then(function(result) {
          return socket.emit("getGroupPictureAlbums", result);
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
      socket.on("create_fanpage_group", function(data) {
        var loggedin_user, _ref, _ref1, _ref2;
        loggedin_user = ((_ref = socket.request) != null ? (_ref1 = _ref.session) != null ? (_ref2 = _ref1.passport) != null ? _ref2.user : void 0 : void 0 : void 0) != null;
        if (!loggedin_user) {
          return;
        }
        return user.getUser(data).then(function(fanpage_user) {
          var group_data, user_name, _ref3, _ref4, _ref5;
          user_name = fanpage_user.name || fanpage_user.username;
          group_data = {
            name: "" + user_name + "'s fan page",
            category: "fanpage",
            created_by: (_ref3 = socket.request) != null ? (_ref4 = _ref3.session) != null ? (_ref5 = _ref4.passport) != null ? _ref5.user : void 0 : void 0 : void 0
          };
          return groups.create(group_data).then(function(result) {
            return user.edit(fanpage_user._id, {
              fanpage_id: result._id
            }).then(function() {
              socket.emit("createGroup", result);
              socket.broadcast.emit("createGroup", result);
              socket.emit("create_fanpage_group", result);
              return socket.broadcast.emit("create_fanpage_group", result);
            });
          });
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
        return chat.load_messages(action, target).then(function(messages) {
          var list, message, message_user, message_users, _i, _len;
          message_users = {};
          for (_i = 0, _len = messages.length; _i < _len; _i++) {
            message = messages[_i];
            message_users[message.user_id] = message.user_id;
          }
          list = [];
          for (message_user in message_users) {
            list.push(user.getUser(message_user));
          }
          return Q.all(list).then(function(users) {
            var _j, _k, _len1, _len2;
            for (_j = 0, _len1 = messages.length; _j < _len1; _j++) {
              message = messages[_j];
              for (_k = 0, _len2 = users.length; _k < _len2; _k++) {
                message_user = users[_k];
                if (!(message_user._id === message.user_id)) {
                  continue;
                }
                message.username = message_user.name || message_user.username;
                message.username_link = message_user.username;
              }
            }
            return socket.emit("load_chat_messages", messages);
          });
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
          return user.getUser(data.user_id).then(function(message_user) {
            result.username = message_user.name || message_user.username;
            result.username_link = message_user.username;
            socket.emit("save_chat_message", result);
            return socket.broadcast.emit("save_chat_message", result);
          });
        });
      });
    });
  };

}).call(this);
