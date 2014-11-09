app = angular.module('app')
app.controller 'profile', ($scope, $stateParams, $timeout, api) ->
  $scope.loggedin = api.checkLogin()

  setUser = (data) ->
    $scope.user = data

    if data.birthday
      currentYear = moment().year()

      birthdayMoment = moment(data.birthday)
      birthdayMonth = birthdayMoment.month()
      birthdayDay = birthdayMoment.date()

      daysUntilBirthday = moment([currentYear, birthdayMonth, birthdayDay]).diff(new Date(), 'days')
      $scope.isBirthday = daysUntilBirthday is 0

      if daysUntilBirthday < 0
        daysUntilBirthday = moment([currentYear + 1, birthdayMonth, birthdayDay]).diff(new Date(), 'days')

      $scope.daysUntilBirthday = daysUntilBirthday

      cakedayMoment = moment(data.created)
      cakedayMonth = cakedayMoment.month()
      cakedayDay = cakedayMoment.date()

      daysUntilCakeday = moment([currentYear, cakedayMonth, cakedayDay]).diff(new Date(), 'days')
      $scope.isCakeday = daysUntilCakeday is 0

      if daysUntilCakeday < 0
        daysUntilCakeday = moment([currentYear + 1, cakedayMonth, cakedayDay]).diff(new Date(), 'days')

      $scope.daysUntilCakeday = daysUntilCakeday

  api
    .findUser($stateParams.id)
    .then (data) ->
      $timeout ->
        setUser(data)
