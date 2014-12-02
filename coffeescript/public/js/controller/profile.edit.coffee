app = angular.module('app')
app.controller 'profile.edit', ($scope, api) ->
  $scope.loggedin = api.checkLogin()
  if !$scope.loggedin
    # TODO: goto frontpage
    console.log "not logged in"

  $scope.saveEdit = ->
    data = angular.copy($scope.user)

    api
      .saveProfileEdit(data._id, data)
      .then (result) ->
        console.log "result", result