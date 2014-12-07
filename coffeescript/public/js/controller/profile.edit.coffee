app = angular.module('app')
app.controller 'profile.edit', ($scope, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.edit_saved = false

  if !$scope.loggedin
    # TODO: goto frontpage
    console.log "not logged in"

  $scope.genders = api.getGenders()

  $scope.save_edit = ->
    data = angular.copy($scope.user)

    api
      .saveProfileEdit(data._id, data)
      .then (result) ->
        $timeout ->
          $scope.edit_saved = true

        $timeout ->
          $scope.edit_saved = false
        , 5000