app = angular.module('app')
app.directive 'groupEdit', ($rootScope, $timeout, $state, api) ->
  restrict: 'E'
  templateUrl: 'directives/group-edit.html'
  scope:
    groupId: '='
  link: ($scope, el, attrs) ->
    $scope.categories = api.getGroupCategories()

    api
      .getGroup($scope.groupId)
      .then (data) ->
        $timeout ->
          data.category = _.find $scope.categories, name: data.category
          data.description = data.original_description
          $rootScope.page_title = "Edit #{data.name}"
          $scope.data = data

    $scope.save = ->
      if !$scope.data
        return false
      if !api.checkLogin()
        return false

      data = angular.copy($scope.data)

      # TODO fix this, needs to be handled in template
      data.category = data.category.name

      api
        .saveGroupEdit($scope.groupId, data)
        .then (result) ->
          $state.transitionTo "group.show", id: $scope.groupId
