app = angular.module('app')
app.controller 'group', ($scope) ->
  $scope.loggedin = api.checkLogin()