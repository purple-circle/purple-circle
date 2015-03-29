app = angular.module('app')
app.directive 'wordGame', ->
  restrict: 'E'
  templateUrl: 'directives/games/words.html'

  controller: ($scope) ->

    # list from https://www.cs.tut.fi/~jkorpela/kielikello/kirjtil.html
    # popular_finnish_chars = [
    #   {character: "a", popularity: 11.62}
    #   {character: "i", popularity: 10.71}
    #   {character: "t", popularity:  9.88}
    #   {character: "n", popularity:  8.67}
    #   {character: "e", popularity:  8.21}
    #   {character: "s", popularity:  7.86}
    #   {character: "l", popularity:  5.76}
    #   {character: "o", popularity:  5.31}
    #   {character: "k", popularity:  5.27}
    #   {character: "u", popularity:  5.00}
    #   {character: "ä", popularity:  4.81}
    #   {character: "m", popularity:  3.51}
    #   {character: "v", popularity:  2.45}
    #   {character: "r", popularity:  2.16}
    #   {character: "j", popularity:  1.93}
    #   {character: "h", popularity:  1.82}
    #   {character: "y", popularity:  1.81}
    #   {character: "p", popularity:  1.66}
    #   {character: "d", popularity:  0.84}
    #   {character: "ö", popularity:  0.47}
    #   {character: "g", popularity:  0.11}
    #   {character: "b", popularity:  0.05}
    #   {character: "f", popularity:  0.05}
    #   {character: "c", popularity:  0.03}
    #   {character: "w", popularity:  0.01}
    #   {character: "å", popularity:  0.00}
    #   {character: "q", popularity:  0.00}
    # ]

    randomCharacter = ->
      possible = 'abcdefghijklmnopqrstuvwxyzöäå'
      possible.charAt(Math.floor(Math.random() * possible.length))


    $scope.selectedLetters = []
    $scope.rows = []

    for row in [0..9]
      letters = []
      for position in [0..9]
        character = randomCharacter()
        data = {
          character
          row
          position
        }

        letters.push data

      $scope.rows.push letters

    validateSelection = (letter) ->
      lastLetter = _.last($scope.selectedLetters)
      if !lastLetter
        return true

      rowIsOk = (
        lastLetter.row is letter.row - 1 or
        lastLetter.row is letter.row + 1 or
        lastLetter.row is letter.row
      )

      if rowIsOk
        return (
          lastLetter.position is letter.position - 1 or
          lastLetter.position is letter.position + 1 or
          lastLetter.position is letter.position
        )

    $scope.selectCharacter = (letter) ->
      selectionAllowed = validateSelection(letter)
      alreadySelected = !!letter.selected

      if !selectionAllowed and !alreadySelected
        return false

      letter.selected = !letter.selected

      copy = angular.copy(letter)


      if copy.selected
        $scope.selectedLetters.push copy
      else
        i = 0
        foundFrom = null
        $scope.selectedLetters = _.reduce $scope.selectedLetters, (memo, selectedLetter) ->
          if copy.row isnt selectedLetter.row or copy.position isnt selectedLetter.position
            memo.push selectedLetter

          i++
          memo
        , []

