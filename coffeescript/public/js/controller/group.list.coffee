app = angular.module('app')
app.controller 'group.list', ($scope, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.list = []

  api
    .getGroupList()
    .then (groups) ->
      $scope.groups = groups

  api
    .socket
    .on "createGroup", (group) ->
      $timeout ->
        $scope.groups.push group
