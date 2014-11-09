app = angular.module('app')
app.controller 'group.list', ($scope, $stateParams, $state, $timeout, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.list = []
  $scope.filter = {}

  $scope.category = $stateParams.category

  setCategoryFilter = (category) ->
    $scope.filter.category = category


  if $scope.category
    setCategoryFilter $scope.category

  $scope.show_all = ->
    $scope.category = false
    $scope.filter = {}
    $state.transitionTo "groups"


  api
    .getGroupList({category: $scope.category})
    .then (groups) ->
      $timeout ->
        $scope.groups = groups

  api
    .socket
    .on "createGroup", (group) ->
      $timeout ->
        $scope.groups.push group
