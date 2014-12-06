app = angular.module('app')
app.controller 'profile.show', ($scope, $timeout, $modal, api) ->
  $scope.loggedin = api.checkLogin()

  $scope.getPictures = ->
    api
      .getProfilePictures($scope.$parent.user._id)
      .then (pictures) ->
        $timeout ->
          $scope.pictures = pictures

  $scope.openModal = (picture) ->
    picture.active = true
    modalInstance = $modal.open
      templateUrl: "profile/profile.picture.modal.html"
      scope: $scope
      size: 'lg'

    modal_opened = ->
    modal_closed = ->
      $timeout ->
        for picture in $scope.pictures
          picture.active = false

    modalInstance.result
      .then modal_opened, modal_closed

  # Fug U angular (router) :/
  done = false
  $scope.$watch ->
    if $scope.$parent.user && !done
      done = true

      $scope.getPictures()