app = angular.module('app')
app.directive 'upload', (api) ->
  restrict: 'E'
  templateUrl: 'directives/upload.html'
  scope:
    groupId: "="
    profileId: "="
    update: "="
    albums: "="
  link: ($scope, el, attrs) ->
    $scope.data = {}

    if $scope.albums
      $scope.data.album = $scope.albums[0]

    upload = (file) ->
      options = {}

      if $scope.groupId
        options.group_id = $scope.groupId

      if $scope.profileId
        options.profile_id = $scope.profileId

      if $scope.data.title
        options.title = $scope.data.title

      if $scope.data.album
        options.album_id = $scope.data.album._id

      options.url = "/group/upload"
      if $scope.profileId
        options.url = "/profile/upload"

      if $scope.update
        options.update = $scope.update

      api.upload_picture(file, options)


    $scope.onFileSelect = ($files) ->
      for file in $files
        upload(file)