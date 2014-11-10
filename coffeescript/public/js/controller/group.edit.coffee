app = angular.module('app')
app.controller 'group.edit', ($scope, $stateParams, api) ->
  $scope.id = $stateParams.id
