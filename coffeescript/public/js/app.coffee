'use strict'

app = angular.module('app', [
  'ui.router'
  'ui.router.compat'
  'templates'
  'angularMoment'
  'angular-parallax'
  'angularFileUpload'
  'ui.bootstrap'
  'ngSanitize'
  'luegg.directives' # scroll glue
])

app.config ($stateProvider, $locationProvider) ->
  $locationProvider.html5Mode(true)
  $stateProvider
    .state 'index',
      url: '/'
      templateUrl: 'index.html'
      controller: 'index'
    .state 'api_stats',
      url: '/api_stats'
      templateUrl: 'api_stats.html'
      controller: 'api_stats'
    .state 'profile',
      abstract: true
      url: '/profile/:id'
      templateUrl: 'profile/profile.html'
      controller: 'profile'
    .state 'profile.show',
      url: ''
      templateUrl: 'profile/profile.show.html'
      controller: 'profile.show'
    .state 'profile.edit',
      url: '/edit'
      templateUrl: 'profile/profile.edit.html'
      controller: 'profile.edit'

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

    .state 'auth-hack',
      url: '/auth/{path:.*}'
      controller: ->
        window.location.reload()

app.run ($rootScope) ->
  $rootScope.page_title = "(><)"

  $rootScope.$on '$stateChangeStart', (event, toState) ->
    # before all states, run google analytics
    # ga('send', 'pageview');
    # ga('send', 'pageview', '/my-overridden-page?id=1');
    # ga('send', 'pageview', {
    #   'page': '/my-overridden-page?id=1',
    #   'title': 'my overridden page'
    # });

    ga('send', 'pageview', toState.url)

