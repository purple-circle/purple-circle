app = angular.module('app')
app.controller 'index', ($scope, api) ->
  $scope.loggedin = api.checkLogin()
  api.userlist()
  api
    .on("userlist")
    .then (users) ->
      $scope.users = users
