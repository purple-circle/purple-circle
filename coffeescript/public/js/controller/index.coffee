app = angular.module('app')
app.controller 'index', ($rootScope, $scope, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  api.userlist()

  $rootScope.page_title = "Home"

  api
    .on("userlist")
    .then (users) ->
      $timeout ->
        $scope.loaded = true
        $scope.users = users
