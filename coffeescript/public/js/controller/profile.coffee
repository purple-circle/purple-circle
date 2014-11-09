app = angular.module('app')
app.controller 'profile', ($scope, $stateParams, api) ->
  $scope.loggedin = api.checkLogin()
  api.findUser($stateParams.id)

  api
    .on("user")
    .then (data) ->
      $scope.user = data

      if data.birthday
        birthdayMoment = moment(data.birthday)
        currentYear = moment().year()
        birthdayMonth = birthdayMoment.month()
        birthdayDay = birthdayMoment.date()

        daysUntilBirthday = moment([currentYear, birthdayMonth, birthdayDay]).diff(new Date(), 'days')
        $scope.isBirthday = daysUntilBirthday > 0

        if daysUntilBirthday < 0
          daysUntilBirthday = moment([currentYear + 1, birthdayMonth, birthdayDay]).diff(new Date(), 'days')

        $scope.daysUntilBirthday = daysUntilBirthday
