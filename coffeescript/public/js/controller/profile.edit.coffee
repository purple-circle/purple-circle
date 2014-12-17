app = angular.module('app')
app.controller 'profile.edit', ($rootScope, $scope, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.edit_saved = false
  $scope.page = 'details'
  $scope.genders = api.getGenders()

  if !$scope.loggedin
    # TODO: goto frontpage
    console.log "not logged in"

  $scope.set_page = (page) ->
    $scope.page = page


  # TODO: redo the architecture, watch should not be needed!
  # TODO: profile edit could be a directive, should fix these problems
  done = false
  $scope.$watch ->
    if $scope.user and $scope.user.bio and !done
      done = true
      username = $scope.user.name || $scope.user.username
      $rootScope.page_title = "Edit #{username}"

      $scope.$bio = $scope.user.bio
      $scope.user.bio = $scope.user.original_bio

  $scope.save_password = ->
    console.log "scope", $scope

  $scope.save_details = ->
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