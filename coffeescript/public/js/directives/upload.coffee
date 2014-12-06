app = angular.module('app')
app.directive 'upload', ($upload) ->
  restrict: 'E'
  templateUrl: 'directives/upload.html'
  scope:
    groupId: "="
    profileId: "="
    update: "="
  link: ($scope, el, attrs) ->
    upload = (file) ->
      data = {}

      if $scope.groupId
        data.group_id = $scope.groupId

      if $scope.profileId
        data.profile_id = $scope.profileId

      if $scope.title
        data.title = $scope.title

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
          console.log "data", data
          # TODO remove this, controller should get push from backend when there is a upload
          $scope.update()


    $scope.onFileSelect = ($files) ->
      for file in $files
        upload(file)