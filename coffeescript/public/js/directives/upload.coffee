app = angular.module('app')
app.directive 'upload', ($upload) ->
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
      data = {}

      if $scope.groupId
        data.group_id = $scope.groupId

      if $scope.profileId
        data.profile_id = $scope.profileId

      if $scope.data.title
        data.title = $scope.data.title

      if $scope.data.album
        data.album_id = $scope.data.album._id

      url = "/group/upload"
      if $scope.profileId
        url = "/profile/upload"

      $scope.upload = $upload
        .upload
          url: url
          data: data
          file: file
        .progress (evt) ->
          console.log "percent: " + parseInt(100.0 * evt.loaded / evt.total)
        .success (data, status, headers, config) ->
          console.log "upload data", data
          # TODO remove this, controller should get push from backend when there is a upload
          $scope.update()


    $scope.onFileSelect = ($files) ->
      for file in $files
        upload(file)