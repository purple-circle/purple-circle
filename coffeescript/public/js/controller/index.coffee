app = angular.module('app')
app.controller 'index', ($scope, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  api.userlist()
  api
    .on("userlist")
    .then (users) ->
      $timeout ->
        $scope.loaded = true
        $scope.users = users
