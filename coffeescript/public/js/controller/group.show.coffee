app = angular.module('app')
app.controller 'group.show', ($scope, $stateParams, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.id = $stateParams.id

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
