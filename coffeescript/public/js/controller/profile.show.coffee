app = angular.module('app')
app.controller 'profile.show', ($scope, api) ->
  $scope.loggedin = api.checkLogin()