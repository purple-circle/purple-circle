app = angular.module('app')
app.controller 'profile', ($scope, $stateParams, $timeout, api) ->
  $scope.loggedin = api.checkLogin()

  setUser = (data) ->
    $scope.user = data

    if data.birthday
      currentYear = moment().year()

      data.birthday = new Date(data.birthday)
      birthdayMoment = moment(data.birthday)
      birthdayMonth = birthdayMoment.month()
      birthdayDay = birthdayMoment.date()

      birthdayMoment = moment([currentYear, birthdayMonth, birthdayDay])
      daysUntilBirthday = birthdayMoment.diff(new Date(), 'days')
      $scope.isBirthday = daysUntilBirthday is 0

      if daysUntilBirthday < 0
        birthdayMoment = moment([currentYear + 1, birthdayMonth, birthdayDay])

      daysUntilBirthday = birthdayMoment.diff(new Date(), 'days')

      $scope.daysUntilBirthday = daysUntilBirthday

      data.created = new Date(data.created)
      cakedayMoment = moment(data.created)
      cakedayMonth = cakedayMoment.month()
      cakedayDay = cakedayMoment.date()

      cakedayMoment = moment([currentYear, cakedayMonth, cakedayDay])
      daysUntilCakeday = cakedayMoment.diff(new Date(), 'days')

      $scope.isCakeday = daysUntilCakeday is 0

      if daysUntilCakeday < 0
        cakedayMoment = moment([currentYear + 1, cakedayMonth, cakedayDay])

      daysUntilCakeday = cakedayMoment.diff(new Date(), 'days')
      $scope.daysUntilCakeday = daysUntilCakeday

    $scope.profile_picture = "http://i.imgur.com/0pXux.jpg"

    if data.facebook_id
      $scope.profile_picture = "https://graph.facebook.com/#{data.facebook_id}/picture?type=large"

  api
    .findUser($stateParams.id)
    .then (data) ->
      $timeout ->
        setUser(data)
