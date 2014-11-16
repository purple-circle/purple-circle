'use strict'

app = angular.module('app', [
  'ui.router'
  'ui.router.compat'
  'templates'
  'angularMoment'
  'angular-parallax'
  'angularFileUpload'
])

app.config ($stateProvider, $locationProvider) ->
  $locationProvider.html5Mode(true)
  $stateProvider
    .state 'index',
      url: '/'
      templateUrl: 'index.html'
      controller: 'index'
    .state 'profile',
      abstract: true
      url: '/profile/:id'
      templateUrl: 'profile/profile.html'
      controller: 'profile'
    .state 'profile.show',
      url: ''
      templateUrl: 'profile/profile.show.html'
      controller: 'profile.show'

    .state 'groups',
      url: '/groups?category'
      templateUrl: 'groups/group.list.html'
      controller: 'group.list'

    .state 'group',
      abstract: true
      url: '/group'
      template: '<ui-view></ui-view>'
    .state 'group.list',
      url: ''
      templateUrl: 'groups/group.list.html'
      controller: 'group.list'
    .state 'group.show',
      url: '/:id'
      templateUrl: 'groups/group.show.html'
      controller: 'group.show'
    .state 'group.create',
      url: '/create'
      templateUrl: 'groups/group.create.html'
      controller: 'group.create'
    .state 'group.edit',
      url: '/:id/edit'
      templateUrl: 'groups/group.edit.html'
      controller: 'group.edit'


    .state 'signup',
      url: '/signup'
      templateUrl: 'signup.html'
      #controller: 'signup'
    .state 'login',
      url: '/login'
      templateUrl: 'login.html'
      #controller: 'login'

    .state 'facebook_url_issue',
      url: '/_=_'
      controller: ->
        window.location.hash = ''
        window.location.href = '/'

    .state 'logout-hack',
      url: '/logout'
      controller: ->
        window.location.reload()

    .state 'auth-hack',
      url: '/auth/{path:.*}'
      controller: ->
        window.location.reload()

app.run()




$(document).ready ->
  bodyElement = $("body")
  barElement = $(".bar")

  height = bodyElement.height()
  scroll = ->
    top = bodyElement.scrollTop()
    if top < 0
      top = 1
    if top > height
      top = height
    position = top / height * 100
    barElement.css "background-position", "left " + position + "%"
    return

  $(window).on "scroll", _.throttle(scroll, 24)
  return
