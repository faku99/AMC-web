var app = angular.module('AMC-web', ['ui.router', 'ngTagsInput']);

app.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {

  $stateProvider
    .state('home', {
      url: '/home',
      templateUrl: '/partials/home.html',
      controller: 'MainCtrl',
      resolve: {
        postPromise: ['questions', function(questions) {
          return questions.getAll();
        }]
      }
    })
    .state('questions', {
      url: '/questions/{id}',
      templateUrl: '/partials/questions.html',
      controller: 'QuestionsCtrl',
      resolve: {
        question: ['$stateParams', 'questions', function($stateParams, questions) {
          return questions.get($stateParams.id);
        }]
      }
    })
    .state('login', {
      url: '/login',
      templateUrl: '/partials/login.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth) {
        if(auth.isLoggedIn()) {
          $state.go('home');
        }
      }]
    })
    .state('register', {
      url: '/register',
      templateUrl: '/partials/register.html',
      controller: 'AuthCtrl',
      onEnter: ['$state', 'auth', function($state, auth) {
        if(auth.isLoggedIn()) {
          $state.go('home');
        }
      }]
    });

  $urlRouterProvider.otherwise('/login');
}]);
