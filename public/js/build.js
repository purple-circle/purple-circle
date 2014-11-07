(function() {
  'use strict';
  var app;

  app = angular.module('app', ['ui.router', 'ui.router.compat', 'templates']);

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
    }).state('groups', {
      url: '/groups',
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
    }).state('logout-hack', {
      url: '/logout',
      controller: function() {
        return window.location.reload();
      }
    }).state('auth-hack', {
      url: '/auth/{path:.*}',
      controller: function() {
        return window.location.reload();
      }
    });
  }]);

  app.run();

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
    $(window).on("scroll", _.throttle(scroll, 50));
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

  app.controller('group.list', ["$scope", "$timeout", "api", function($scope, $timeout, api) {
    $scope.loggedin = api.checkLogin();
    $scope.list = [];
    api.getGroupList().then(function(groups) {
      return $scope.groups = groups;
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

  app.controller('group.show', ["$scope", "$stateParams", "api", function($scope, $stateParams, api) {
    var getCreator;
    $scope.loggedin = api.checkLogin();
    $scope.id = $stateParams.id;
    api.getGroup($stateParams.id);
    api.on("getGroup").then(function(group) {
      $scope.group = group;
      return getCreator(group.created_by);
    });
    return getCreator = function(userid) {
      api.findUser(userid);
      return api.on("user").then(function(data) {
        return $scope.created_by = data;
      });
    };
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('index', ["$scope", "api", function($scope, api) {
    $scope.loggedin = api.checkLogin();
    api.userlist();
    return api.on("userlist").then(function(users) {
      return $scope.users = users;
    });
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('profile', ["$scope", "$stateParams", "api", function($scope, $stateParams, api) {
    $scope.loggedin = api.checkLogin();
    api.findUser($stateParams.id);
    return api.on("user").then(function(data) {
      return $scope.user = data;
    });
  }]);

}).call(this);

(function() {
  var app;

  app = angular.module('app');

  app.controller('profile.show', ["$scope", "api", function($scope, api) {
    return $scope.loggedin = api.checkLogin();
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
        $scope.categories = [
          {
            name: "Generic"
          }
        ];
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

  app.factory('api', ["$q", function($q) {
    var socket;
    socket = io();
    return {
      socket: socket,
      on: function(event) {
        var deferred;
        deferred = $q.defer();
        socket.on(event, deferred.resolve);
        return deferred.promise;
      },
      saveComment: function(data) {
        return socket.emit("savecomment", data);
      },
      findUser: function(id) {
        return socket.emit("getuser", id);
      },
      userlist: function() {
        return socket.emit("getuserlist");
      },
      checkLogin: function() {
        return window.userLoginStatus;
      },
      createGroup: function(data) {
        socket.emit("createGroup", data);
        return this.on("createGroup");
      },
      getGroup: function(id) {
        socket.emit("getGroup", id);
        return this.on("getGroup");
      },
      getGroupList: function() {
        socket.emit("getGroupList");
        return this.on("getGroupList");
      }
    };
  }]);

}).call(this);
