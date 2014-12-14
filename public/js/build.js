(function() {
  'use strict';
  var app;

  app = angular.module('app', ['ui.router', 'ui.router.compat', 'templates', 'angularMoment', 'angular-parallax', 'angularFileUpload', 'ui.bootstrap', 'ngSanitize', 'luegg.directives']);

  app.config(["$stateProvider", "$locationProvider", function($stateProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    return $stateProvider.state('index', {
      url: '/',
      templateUrl: 'index.html',
      controller: 'index'
    }).state('profile', {
      abstract: true,
      url: '/profile/:id',
      templateUrl: 'profile/profile.html',
      controller: 'profile'
    }).state('profile.show', {
      url: '',
      templateUrl: 'profile/profile.show.html',
      controller: 'profile.show'
    }).state('profile.edit', {
      url: '/edit',
      templateUrl: 'profile/profile.edit.html',
      controller: 'profile.edit'
    }).state('groups', {
      url: '/groups?category',
      templateUrl: 'groups/group.list.html',
      controller: 'group.list'
    }).state('group', {
      abstract: true,
      url: '/group',
      template: '<ui-view></ui-view>'
    }).state('group.list', {
      url: '',
      templateUrl: 'groups/group.list.html',
      controller: 'group.list'
    }).state('group.show', {
      url: '/:id',
      templateUrl: 'groups/group.show.html',
      controller: 'group.show'
    }).state('group.create', {
      url: '/create',
      templateUrl: 'groups/group.create.html',
      controller: 'group.create'
    }).state('group.edit', {
      url: '/:id/edit',
      templateUrl: 'groups/group.edit.html',
      controller: 'group.edit'
    }).state('signup', {
      url: '/signup',
      templateUrl: 'signup.html'
    }).state('login', {
      url: '/login',
      templateUrl: 'login.html'
    }).state('facebook_url_issue', {
      url: '/_=_',
      controller: function() {
        window.location.hash = '';
        return window.location.href = '/';
      }
    }).state('auth-hack', {
      url: '/auth/{path:.*}',
      controller: function() {
        return window.location.reload();
      }
    });
  }]);

  app.run(["$rootScope", function($rootScope) {
    return $rootScope.page_title = "(><)";
  }]);

  $(document).ready(function() {
    var barElement, bodyElement, height, scroll;
    bodyElement = $("body");
    barElement = $(".bar");
    height = bodyElement.height();
    scroll = function() {
      var position, top;
      top = bodyElement.scrollTop();
      if (top < 0) {
        top = 1;
      }
      if (top > height) {
        top = height;
      }
      position = top / height * 100;
      barElement.css("background-position", "left " + position + "%");
    };
    $(window).on("scroll", _.throttle(scroll, 24));
  });

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('group', ["$scope", function($scope) {
    return $scope.loggedin = api.checkLogin();
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('group.create', ["$scope", "api", function($scope, api) {}]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('group.edit', ["$scope", "$stateParams", "api", function($scope, $stateParams, api) {
    return $scope.id = $stateParams.id;
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('group.list', ["$rootScope", "$scope", "$stateParams", "$state", "$timeout", "api", function($rootScope, $scope, $stateParams, $state, $timeout, api) {
    var setCategoryFilter;
    $scope.loggedin = api.checkLogin();
    $scope.list = [];
    $scope.filter = {};
    $scope.category = $stateParams.category;
    $rootScope.page_title = "Groups";
    if ($scope.category) {
      $rootScope.page_title += " " + $scope.category;
    }
    setCategoryFilter = function(category) {
      return $scope.filter.category = category;
    };
    if ($scope.category) {
      setCategoryFilter($scope.category);
    }
    $scope.show_all = function() {
      $scope.category = false;
      $scope.filter = {};
      return $state.transitionTo("groups");
    };
    api.getGroupList({
      category: $scope.category
    }).then(function(groups) {
      return $timeout(function() {
        return $scope.groups = groups;
      });
    });
    return api.socket.on("createGroup", function(group) {
      return $timeout(function() {
        return $scope.groups.push(group);
      });
    });
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('group.show', ["$rootScope", "$scope", "$stateParams", "$timeout", "$modal", "api", function($rootScope, $scope, $stateParams, $timeout, $modal, api) {
    var checkMembership, done, getCreator, getGroup, getMemberList, getPictureAlbums;
    $scope.loggedin = api.checkLogin();
    $scope.id = $stateParams.id;
    $scope.membership_checked = false;
    $scope.not_member = true;
    getGroup = function() {
      return api.getGroup($scope.id).then(function(group) {
        return $timeout(function() {
          $rootScope.page_title = group.name;
          $scope.group = group;
          return getCreator(group.created_by);
        });
      });
    };
    $scope.openModal = function(picture) {
      var modalInstance, modal_closed, modal_opened;
      picture.active = true;
      modalInstance = $modal.open({
        templateUrl: "groups/group.picture.modal.html",
        scope: $scope,
        size: 'lg'
      });
      modal_opened = function() {};
      modal_closed = function() {
        return $timeout(function() {
          var _i, _len, _ref, _results;
          _ref = $scope.pictures;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            picture = _ref[_i];
            _results.push(picture.active = false);
          }
          return _results;
        });
      };
      return modalInstance.result.then(modal_opened, modal_closed);
    };
    checkMembership = function() {
      if (!$scope.loggedin) {
        return false;
      }
      return api.checkMembership($scope.id).then(function(membership) {
        return $timeout(function() {
          $scope.membership_checked = true;
          return $scope.not_member = membership !== true;
        });
      });
    };
    if ($scope.loggedin) {
      api.getLoggedinUser().then(function(user) {
        return $timeout(function() {
          return $scope.loggedinUser = user;
        });
      });
    }
    getMemberList = function() {
      checkMembership();
      return api.getMemberList($scope.id).then(function(list) {
        return $timeout(function() {
          return $scope.memberlist = list;
        });
      });
    };
    $scope.getPictures = function() {
      return api.getGroupPictures($scope.id).then(function(pictures) {
        return $timeout(function() {
          return $scope.pictures = pictures;
        });
      });
    };
    getPictureAlbums = function() {
      return api.getGroupPictureAlbums($scope.id).then(function(picture_albums) {
        return $timeout(function() {
          return $scope.picture_albums = picture_albums;
        });
      });
    };
    $scope.join = function() {
      if (!$scope.loggedin) {
        return false;
      }
      return api.joinGroup($scope.id).then(getMemberList);
    };
    $scope.leave = function() {
      if (!$scope.loggedin) {
        return false;
      }
      return api.leaveGroup($scope.id).then(function() {
        getMemberList();
        return checkMembership();
      });
    };
    getCreator = function(userid) {
      return api.findUser(userid).then(function(data) {
        return $timeout(function() {
          return $scope.created_by = data;
        });
      });
    };
    done = false;
    return $scope.$watch(function() {
      if ($scope.id && !done) {
        done = true;
        getGroup();
        getMemberList();
        getPictureAlbums();
        return $scope.getPictures();
      }
    });
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('index', ["$rootScope", "$scope", "$timeout", "api", function($rootScope, $scope, $timeout, api) {
    $scope.loggedin = api.checkLogin();
    api.userlist();
    $rootScope.page_title = "Home";
    return api.on("userlist").then(function(users) {
      return $timeout(function() {
        $scope.loaded = true;
        return $scope.users = users;
      });
    });
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('profile', ["$rootScope", "$scope", "$stateParams", "$timeout", "api", function($rootScope, $scope, $stateParams, $timeout, api) {
    var get_user, setUser;
    $scope.loggedin = api.checkLogin();
    $scope.create_fanpage = function() {
      return api.create_fanpage_group($scope.user._id).then(get_user);
    };
    setUser = function(data) {
      var birthdayDay, birthdayMoment, birthdayMonth, cakedayDay, cakedayMoment, cakedayMonth, currentYear, daysUntilBirthday, daysUntilCakeday;
      $scope.user = data;
      if ($scope.$bio) {
        $scope.user.bio = $scope.$bio;
      }
      $rootScope.page_title = data.name || data.username;
      if (data.birthday) {
        currentYear = moment().year();
        data.birthday = new Date(data.birthday);
        birthdayMoment = moment(data.birthday);
        birthdayMonth = birthdayMoment.month();
        birthdayDay = birthdayMoment.date();
        birthdayMoment = moment([currentYear, birthdayMonth, birthdayDay]);
        daysUntilBirthday = birthdayMoment.diff(new Date(), 'days');
        $scope.isBirthday = daysUntilBirthday === 0;
        if (daysUntilBirthday < 0) {
          birthdayMoment = moment([currentYear + 1, birthdayMonth, birthdayDay]);
        }
        daysUntilBirthday = birthdayMoment.diff(new Date(), 'days');
        $scope.daysUntilBirthday = daysUntilBirthday;
        data.created = new Date(data.created);
        cakedayMoment = moment(data.created);
        cakedayMonth = cakedayMoment.month();
        cakedayDay = cakedayMoment.date();
        cakedayMoment = moment([currentYear, cakedayMonth, cakedayDay]);
        daysUntilCakeday = cakedayMoment.diff(new Date(), 'days');
        $scope.isCakeday = daysUntilCakeday === 0;
        if (daysUntilCakeday < 0) {
          cakedayMoment = moment([currentYear + 1, cakedayMonth, cakedayDay]);
        }
        daysUntilCakeday = cakedayMoment.diff(new Date(), 'days');
        $scope.daysUntilCakeday = daysUntilCakeday;
      }
      $scope.profile_picture = "http://i.imgur.com/0pXux.jpg";
      if (data.facebook_id) {
        $scope.profile_picture = "https://graph.facebook.com/" + data.facebook_id + "/picture?type=large";
      }
      if (data.picture_url) {
        return $scope.profile_picture = data.picture_url;
      }
    };
    get_user = function() {
      return api.findUser($stateParams.id).then(function(data) {
        return $timeout(function() {
          return setUser(data);
        });
      });
    };
    return get_user();
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('profile.edit', ["$scope", "$timeout", "api", function($scope, $timeout, api) {
    var done;
    $scope.loggedin = api.checkLogin();
    $scope.edit_saved = false;
    if (!$scope.loggedin) {
      console.log("not logged in");
    }
    $scope.genders = api.getGenders();
    done = false;
    $scope.$watch(function() {
      if ($scope.user.bio && !done) {
        done = true;
        $scope.$bio = $scope.user.bio;
        return $scope.user.bio = $scope.user.original_bio;
      }
    });
    return $scope.save_edit = function() {
      var data;
      data = angular.copy($scope.user);
      if (data.bio) {
        $scope.user.original_bio = data.bio;
      }
      return api.saveProfileEdit(data._id, data).then(function(result) {
        $timeout(function() {
          return $scope.edit_saved = true;
        });
        return $timeout(function() {
          return $scope.edit_saved = false;
        }, 5000);
      });
    };
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('profile.show', ["$scope", "$timeout", "$modal", "api", function($scope, $timeout, $modal, api) {
    var done;
    $scope.loggedin = api.checkLogin();
    $scope.uploadProfilePicture = function($files) {
      var options;
      console.log("yolo", $files);
      options = {
        profile_id: $scope.user._id,
        url: "/profile/upload/default"
      };
      return api.upload_picture($files[0], options);
    };
    $scope.set_profile_picture = function(picture) {
      return api.set_profile_picture($scope.user._id, picture._id).then(function(result) {
        return console.log("result", result);
      });
    };
    $scope.getPictures = function() {
      return api.getProfilePictures($scope.$parent.user._id).then(function(pictures) {
        return $timeout(function() {
          return $scope.pictures = pictures;
        });
      });
    };
    $scope.openModal = function(picture) {
      var modalInstance, modal_closed, modal_opened;
      picture.active = true;
      modalInstance = $modal.open({
        templateUrl: "profile/profile.picture.modal.html",
        scope: $scope,
        size: 'lg'
      });
      modal_opened = function() {};
      modal_closed = function() {
        return $timeout(function() {
          var _i, _len, _ref, _results;
          _ref = $scope.pictures;
          _results = [];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            picture = _ref[_i];
            _results.push(picture.active = false);
          }
          return _results;
        });
      };
      return modalInstance.result.then(modal_opened, modal_closed);
    };
    done = false;
    return $scope.$watch(function() {
      if ($scope.$parent.user && !done) {
        done = true;
        return $scope.getPictures();
      }
    });
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.directive('chat', ["$timeout", "api", function($timeout, api) {
    return {
      restrict: 'E',
      templateUrl: 'directives/chat.html',
      scope: {
        action: "@",
        target: "="
      },
      link: function($scope, el, attrs) {
        var filters;
        $scope.loggedin = api.checkLogin();
        $scope.message = '';
        $scope.messages = [];
        filters = {
          action: $scope.action,
          target: $scope.target
        };
        api.load_chat_messages(filters).then(function(messages) {
          return $timeout(function() {
            return $scope.messages = messages;
          });
        });
        api.socket.off("save_chat_message");
        api.socket.on("save_chat_message", function(message) {
          return $timeout(function() {
            return $scope.messages.push(message);
          });
        });
        return $scope.save_message = function() {
          var data;
          if (!$scope.action || !$scope.target) {
            return false;
          }
          data = {
            message: $scope.message,
            action: $scope.action,
            target: $scope.target
          };
          return api.save_chat_message(data).then(function(result) {
            return $timeout(function() {
              return $scope.message = '';
            });
          });
        };
      }
    };
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.directive('groupCreate', ["api", function(api) {
    return {
      restrict: 'E',
      templateUrl: 'directives/group-create.html',
      link: function($scope, el, attrs) {
        var originalData;
        $scope.categories = api.getGroupCategories();
        $scope.data = {
          category: $scope.categories[0]
        };
        originalData = angular.copy($scope.data);
        return $scope.create = function() {
          var data;
          if (!$scope.data) {
            return false;
          }
          if (!api.checkLogin()) {
            return false;
          }
          data = angular.copy($scope.data);
          data.category = data.category.name;
          return api.createGroup(data).then(function(result) {
            return $scope.data = originalData;
          });
        };
      }
    };
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.directive('groupEdit', ["$rootScope", "$timeout", "$state", "api", function($rootScope, $timeout, $state, api) {
    return {
      restrict: 'E',
      templateUrl: 'directives/group-edit.html',
      scope: {
        groupId: '='
      },
      link: function($scope, el, attrs) {
        $scope.categories = api.getGroupCategories();
        api.getGroup($scope.groupId).then(function(data) {
          return $timeout(function() {
            data.category = _.find($scope.categories, {
              name: data.category
            });
            data.description = data.original_description;
            $rootScope.page_title = "Edit " + data.name;
            return $scope.data = data;
          });
        });
        return $scope.save = function() {
          var data;
          if (!$scope.data) {
            return false;
          }
          if (!api.checkLogin()) {
            return false;
          }
          data = angular.copy($scope.data);
          data.category = data.category.name;
          return api.saveGroupEdit($scope.groupId, data).then(function(result) {
            return $state.transitionTo("group.show", {
              id: $scope.groupId
            });
          });
        };
      }
    };
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.directive('login', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/login.html'
    };
  });

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.directive('myProfileInfo', ["$timeout", "api", function($timeout, api) {
    return {
      restrict: 'E',
      templateUrl: 'directives/my-profile-info.html',
      link: function($scope, el, attrs) {
        $scope.loggedin = api.checkLogin();
        return api.getLoggedinUser().then(function(data) {
          return $timeout(function() {
            return $scope.mydata = data;
          });
        });
      }
    };
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.directive('signupButtons', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/signup-buttons.html'
    };
  });

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.directive('signup', function() {
    return {
      restrict: 'E',
      templateUrl: 'directives/signup.html'
    };
  });

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.directive('upload', ["api", function(api) {
    return {
      restrict: 'E',
      templateUrl: 'directives/upload.html',
      scope: {
        groupId: "=",
        profileId: "=",
        update: "=",
        albums: "="
      },
      link: function($scope, el, attrs) {
        var upload;
        $scope.data = {};
        if ($scope.albums) {
          $scope.data.album = $scope.albums[0];
        }
        upload = function(file) {
          var options;
          options = {};
          if ($scope.groupId) {
            options.group_id = $scope.groupId;
          }
          if ($scope.profileId) {
            options.profile_id = $scope.profileId;
          }
          if ($scope.data.title) {
            options.title = $scope.data.title;
          }
          if ($scope.data.album) {
            options.album_id = $scope.data.album._id;
          }
          options.url = "/group/upload";
          if ($scope.profileId) {
            options.url = "/profile/upload";
          }
          if ($scope.update) {
            options.update = $scope.update;
          }
          return api.upload_picture(file, options);
        };
        return $scope.onFileSelect = function($files) {
          var file, _i, _len, _results;
          _results = [];
          for (_i = 0, _len = $files.length; _i < _len; _i++) {
            file = $files[_i];
            _results.push(upload(file));
          }
          return _results;
        };
      }
    };
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.filter("newlines", function() {
    return function(text) {
      return text.replace(/\n/g, "<br/>");
    };
  });

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.factory('api', ["$q", "$upload", function($q, $upload) {
    var socket;
    socket = io();
    return {
      socket: socket,
      upload_picture: function(file, options) {
        var data, url;
        data = {};
        if (options.group_id) {
          data.group_id = options.group_id;
        }
        if (options.profile_id) {
          data.profile_id = options.profile_id;
        }
        if (options.title) {
          data.title = options.title;
        }
        if (options.album) {
          data.album_id = options.album_id;
        }
        url = options.url;
        return $upload.upload({
          url: url,
          data: data,
          file: file
        }).progress(function(evt) {
          return console.log("percent: " + parseInt(100.0 * evt.loaded / evt.total));
        }).success(function(data, status, headers, config) {
          console.log("upload data", data);
          if (options.update) {
            return options.update();
          }
        });
      },
      on: function(event) {
        var deferred;
        deferred = $q.defer();
        socket.once(event, deferred.resolve);
        return deferred.promise;
      },
      saveComment: function(data) {
        return socket.emit("savecomment", data);
      },
      findUser: function(id) {
        socket.emit("getuser", id);
        return this.on("user");
      },
      userlist: function() {
        return socket.emit("getuserlist");
      },
      checkLogin: function() {
        return window.userLoginStatus;
      },
      getLoggedinUser: function() {
        socket.emit("getLoggedinUser");
        return this.on("getLoggedinUser");
      },
      saveProfileEdit: function(id, data) {
        socket.emit("edit_user", {
          id: id,
          data: data
        });
        return this.on("edit_user");
      },
      getProfilePictures: function(id) {
        socket.emit("getProfilePictures", id);
        return this.on("getProfilePictures");
      },
      set_profile_picture: function(user_id, picture_id) {
        socket.emit("set_profile_picture", {
          user_id: user_id,
          picture_id: picture_id
        });
        return this.on("set_profile_picture");
      },
      create_fanpage_group: function(user_id) {
        socket.emit("create_fanpage_group", user_id);
        return this.on("create_fanpage_group");
      },
      createGroup: function(data) {
        socket.emit("createGroup", data);
        return this.on("createGroup");
      },
      saveGroupEdit: function(id, data) {
        socket.emit("editGroup", {
          id: id,
          data: data
        });
        return this.on("editGroup");
      },
      getGroup: function(id) {
        socket.emit("get_group", id);
        return this.on("get_group");
      },
      joinGroup: function(id) {
        socket.emit("joinGroup", id);
        return this.on("joinGroup");
      },
      leaveGroup: function(id) {
        socket.emit("leaveGroup", id);
        return this.on("leaveGroup");
      },
      getGroupPictures: function(id) {
        socket.emit("getGroupPictures", id);
        return this.on("getGroupPictures");
      },
      getGroupPictureAlbums: function(id) {
        socket.emit("getGroupPictureAlbums", id);
        return this.on("getGroupPictureAlbums");
      },
      checkMembership: function(id) {
        socket.emit("checkMembership", id);
        return this.on("checkMembership");
      },
      getMemberList: function(id) {
        socket.emit("getMemberList", id);
        return this.on("getMemberList");
      },
      getGroupList: function(data) {
        socket.emit("getGroupList", data);
        return this.on("getGroupList");
      },
      load_chat_messages: function(data) {
        socket.emit("load_chat_messages", data);
        return this.on("load_chat_messages");
      },
      save_chat_message: function(data) {
        socket.emit("save_chat_message", data);
        return this.on("save_chat_message");
      },
      getGroupCategories: function() {
        return [
          {
            name: "Generic"
          }, {
            name: "Music"
          }, {
            name: "Development"
          }, {
            name: "Cartoon"
          }, {
            name: "Fanpage"
          }
        ];
      },
      getGenders: function() {
        return [
          {
            name: "male"
          }, {
            name: "female"
          }, {
            name: "doge"
          }, {
            name: "furry"
          }, {
            name: "yolo"
          }
        ];
      }
    };
  }]);

}).call(this);
