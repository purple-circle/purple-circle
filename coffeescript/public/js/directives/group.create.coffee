app = angular.module('app')
app.directive 'groupCreate', (api) ->
  restrict: 'E'
  templateUrl: 'directives/group-create.html'
  link: ($scope, el, attrs) ->
    $scope.categories = [
      {
        name: "Generic"
      }
    ]

    $scope.data = {
      category: $scope.categories[0]
    }

    originalData = angular.copy($scope.data)

    $scope.create = ->
      if !$scope.data
        return false
      if !api.checkLogin()
        return false

      data = angular.copy($scope.data)
      data.category = data.category.name

      api
        .createGroup(data)
        .then (result) ->
          $scope.data = originalData
