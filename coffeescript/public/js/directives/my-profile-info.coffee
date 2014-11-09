app = angular.module('app')
app.directive 'myProfileInfo', ($timeout, api) ->
  restrict: 'E'
  templateUrl: 'directives/my-profile-info.html'
  link: ($scope, el, attrs) ->
    $scope.loggedin = api.checkLogin()

    api
      .getLoggedinUser()
      .then (data) ->
        $timeout ->
          $scope.mydata = data
