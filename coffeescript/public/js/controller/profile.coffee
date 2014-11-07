app = angular.module('app')
app.controller 'profile', ($scope, $stateParams, api) ->
  $scope.loggedin = api.checkLogin()
  api.findUser($stateParams.id)

  api
    .on("user")
    .then (data) ->
      $scope.user = data
