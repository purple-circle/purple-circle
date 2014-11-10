app = angular.module('app')
app.controller 'group.show', ($scope, $stateParams, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.id = $stateParams.id

  if $scope.loggedin
    api
      .getLoggedinUser()
      .then (user) ->
        $timeout ->
          $scope.loggedinUser = user

  api
    .getGroup($scope.id)
    .then (group) ->
      $timeout ->
        $scope.group = group
        getCreator(group.created_by)

  getCreator = (userid) ->
    api
      .findUser(userid)
      .then (data) ->
        $timeout ->
          $scope.created_by = data
