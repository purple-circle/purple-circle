app = angular.module('app')
app.controller 'group', ($scope, api) ->
  $scope.loggedin = api.checkLogin()