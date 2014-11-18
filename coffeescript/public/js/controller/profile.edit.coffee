app = angular.module('app')
app.controller 'profile.edit', ($scope, api) ->
  $scope.loggedin = api.checkLogin()
  if !$scope.loggedin
    # TODO: goto frontpage
    console.log "not logged in"

  $scope.saveEdit = ->
    console.log "save"