app = angular.module('app')
app.controller 'api_stats', ($scope, $timeout, api) ->
  api
    .api_stats()
    .then (stats) ->
      $timeout ->
        $scope.stats = stats

        $scope.group_stats = _.reduce stats, (memo, stats) ->
          data = _.find memo, name: stats.name

          if !data
            data = {name: stats.name, count: 0}
            memo.push data

          data.count++

          memo
        , []