app = angular.module('app')
app.directive 'upload', ($upload) ->
  restrict: 'E'
  templateUrl: 'directives/upload.html'
  scope:
    groupId: "="
    update: "="
  link: ($scope, el, attrs) ->
    upload = (file) ->
      $scope.upload = $upload
        .upload
          url: "/group/upload"
          data:
            title: $scope.title
            group_id: $scope.groupId
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