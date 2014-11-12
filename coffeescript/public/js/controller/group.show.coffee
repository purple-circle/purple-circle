app = angular.module('app')
app.controller 'group.show', ($scope, $stateParams, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.id = $stateParams.id


  $scope.membership_checked = true
  $scope.not_member = true

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

  getMemberList = ->
    api
      .getMemberList($scope.id)
      .then (list) ->
        $timeout ->
          $scope.memberlist = list

  getMemberList()

  $scope.join = ->
    if !$scope.loggedin
      return false

    api
      .joinGroup($scope.id)
      .then getMemberList

  getCreator = (userid) ->
    api
      .findUser(userid)
      .then (data) ->
        $timeout ->
          $scope.created_by = data
