app = angular.module('app')
app.directive 'groupEdit', ($timeout, $state, api) ->
  restrict: 'E'
  templateUrl: 'directives/group-edit.html'
  scope:
    groupId: '='
  link: ($scope, el, attrs) ->
    console.log "$scope", $scope
    $scope.categories = [
      {
        name: "Generic"
      }
      {
        name: "Music"
      }
      {
        name: "Development"
      }
    ]

    $scope.data = {
      category: $scope.categories[0]
    }

    originalData = angular.copy($scope.data)


    api
      .getGroup($scope.groupId)
      .then (data) ->
        $timeout ->
          data.category = _.find $scope.categories, name: data.category
          $scope.data = data

    $scope.save = ->
      if !$scope.data
        return false
      if !api.checkLogin()
        return false

      console.log "mmmm"

      data = angular.copy($scope.data)
      data.category = data.category.name

      $state.transitionTo "group.show", id: $scope.id

      ###
      api
        .saveGroupEdit($scope.id, data)
        .then (result) ->
          $scope.data = originalData
      ###