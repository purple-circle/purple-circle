app = angular.module('app')
app.controller 'profile.edit', ($scope, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.edit_saved = false

  if !$scope.loggedin
    # TODO: goto frontpage
    console.log "not logged in"

  $scope.genders = api.getGenders()

  # TODO: redo the architecture, watch should not be needed!
  # TODO: profile edit could be a directive, should fix these problems
  done = false
  $scope.$watch ->
    if $scope.user.bio and !done
      done = true
      $scope.$bio = $scope.user.bio
      $scope.user.bio = $scope.user.original_bio

  $scope.save_edit = ->
    data = angular.copy($scope.user)
    if data.bio
      $scope.user.original_bio = data.bio

    api
      .saveProfileEdit(data._id, data)
      .then (result) ->
        $timeout ->
          $scope.edit_saved = true

        $timeout ->
          $scope.edit_saved = false
        , 5000