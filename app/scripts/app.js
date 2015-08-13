'use strict';

/**
 * @ngdoc overview
 * @name AMC-web
 * @description
 * # Web implementation of AMC.
 *
 * Main module of the application.
 */
angular
  .module('AMC-web', [
    'ui.router',
    'ngAnimate',
    'ngTagsInput'
  ])
  .config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when('/dashboard', '/dashboard/create');
    $urlRouterProvider.otherwise('/login');

    $stateProvider
      .state('base', {
        abstract: true,
        url: '',
        templateUrl: 'views/base.html'
      })
        .state('login', {
          url: '/login',
          parent: 'base',
          templateUrl: 'views/login.html',
          controller: 'LoginCtrl'
        })
        .state('register', {
          url: '/register',
          parent: 'base',
          templateUrl: 'views/register.html',
          controller: 'LoginCtrl'
        })
        .state('dashboard', {
          url: '/dashboard',
          parent: 'base',
          templateUrl: 'views/dashboard.html',
          controller: 'DashboardCtrl'
        })
          .state('create', {
            url: '/create',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/create.html',
            controller: 'MainCtrl'
          })
          .state('list', {
            url: '/list',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/list.html',
            controller: 'MainCtrl',
            resolve: {
              postPromise: function(questions) {
                return questions.getAll();
              }
            }
          })
          .state('question', {
            url: '/question/{questionId}',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/question.html',
            controller: 'QuestionsCtrl',
            resolve: {
              question: function(questions, $stateParams) {
                return questions.get($stateParams.questionId);
              }
            }
          })
          .state('test', {
            url: '/test',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/test.html',
            controller: 'TestsCtrl'
          });

  });
