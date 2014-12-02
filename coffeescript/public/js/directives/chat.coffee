app = angular.module('app')
app.directive 'chat', ($timeout, api) ->
  restrict: 'E'
  templateUrl: 'directives/chat.html'
  scope:
    action: "@"
    target: "="
  link: ($scope, el, attrs) ->
    $scope.loggedin = api.checkLogin()
    $scope.message = ''

    $scope.messages = []


    api
      .load_chat_messages($scope.action, $scope.target)
      .then (messages) ->
        $timeout ->
          $scope.messages = messages

    api
      .socket
      .on "save_chat_message", (message) ->
        console.log "message", message
        $timeout ->
          $scope.messages.push message


    $scope.save_message = ->
      if !$scope.action || !$scope.target
        return false

      data =
        message: $scope.message
        action: $scope.action
        target: $scope.target


      api
        .save_chat_message(data)
        .then (result) ->
          $timeout ->
            $scope.message = ''
