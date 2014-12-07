app = angular.module('app')
app.controller 'group.show', ($rootScope, $scope, $stateParams, $timeout, $modal, api) ->
  $scope.loggedin = api.checkLogin()
  $scope.id = $stateParams.id

  $scope.membership_checked = false
  $scope.not_member = true

  getGroup = ->
    api
      .getGroup($scope.id)
      .then (group) ->
        $timeout ->
          $rootScope.page_title = group.name

          $scope.group = group
          getCreator(group.created_by)

  $scope.openModal = (picture) ->
    picture.active = true
    modalInstance = $modal.open
      templateUrl: "groups/group.picture.modal.html"
      scope: $scope
      size: 'lg'

    modal_opened = ->
    modal_closed = ->
      $timeout ->
        for picture in $scope.pictures
          picture.active = false

    modalInstance.result
      .then modal_opened, modal_closed


  checkMembership = ->
    if !$scope.loggedin
      return false

    api
      .checkMembership($scope.id)
      .then (membership) ->
        $timeout ->
          $scope.membership_checked = true
          $scope.not_member = membership isnt true


  if $scope.loggedin
    api
      .getLoggedinUser()
      .then (user) ->
        $timeout ->
          $scope.loggedinUser = user

  getMemberList = ->
    checkMembership()
    api
      .getMemberList($scope.id)
      .then (list) ->
        $timeout ->
          $scope.memberlist = list

  $scope.getPictures = ->
    api
      .getGroupPictures($scope.id)
      .then (pictures) ->
        $timeout ->
          $scope.pictures = pictures

  getPictureAlbums = ->
    api
      .getGroupPictureAlbums($scope.id)
      .then (picture_albums) ->
        $timeout ->
          $scope.picture_albums = picture_albums

  $scope.join = ->
    if !$scope.loggedin
      return false

    api
      .joinGroup($scope.id)
      .then getMemberList

  $scope.leave = ->
    if !$scope.loggedin
      return false

    api
      .leaveGroup($scope.id)
      .then ->
        getMemberList()
        checkMembership()

  getCreator = (userid) ->
    api
      .findUser(userid)
      .then (data) ->
        $timeout ->
          $scope.created_by = data

  # FUG U ANGULAR
  done = false
  $scope.$watch ->
    if $scope.id and !done
      done = true
      getGroup()
      getMemberList()
      getPictureAlbums()
      $scope.getPictures()
