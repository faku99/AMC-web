'use strict';

angular
  .module('AMC-web', [
    'ui.router',
    'ngAnimate',
    'ngTagsInput',
    'ui.bootstrap',
    'cgPrompt'
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
          controller: 'AuthCtrl'
        })
        .state('register', {
          url: '/register',
          parent: 'base',
          templateUrl: 'views/register.html',
          controller: 'AuthCtrl'
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
            controller: 'CreateCtrl'
          })
          .state('list', {
            url: '/list',
            parent: 'dashboard',
            templateUrl: 'views/dashboard/list.html',
            controller: 'ListCtrl',
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
            controller: 'QuestionCtrl',
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
            controller: 'TestCtrl'
          });

  });
