app = angular.module('app')
app.controller 'profile.show', ($rootScope, $scope, $timeout, $modal, api) ->
  $scope.loggedin = api.checkLogin()

  $scope.uploadProfilePicture = ($files) ->
    options =
      profile_id: $scope.user._id
      url: "/profile/upload/default"

    # TODO: Set profile picture album id
    #options.album_id = 123

    api.upload_picture($files[0], options)

  $scope.set_profile_picture = (picture) ->
    api
      .set_profile_picture($scope.user._id, picture._id)
      .then (result) ->
        console.log "result", result

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
      $rootScope.page_title = $scope.$parent.user.name || $scope.$parent.user.username
      done = true

      $scope.getPictures()