app = angular.module('app')
app.controller 'group.show', ($scope, $stateParams, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.id = $stateParams.id
  api.getGroup($stateParams.id)

  api
    .on("getGroup")
    .then (group) ->
      $scope.group = group
      getCreator(group.created_by)

  getCreator = (userid) ->
    api.findUser(userid)

    api
      .on("user")
      .then (data) ->
        $scope.created_by = data
