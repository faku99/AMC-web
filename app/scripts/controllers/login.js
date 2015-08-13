'use strict';

/**
 * @ngdoc function
 * @name AMC-web.controller:LoginCtrl
 * @description Login controller.
 * # LoginCtrl
 * Controller of AMC-web
 */
angular.module('AMC-web')
  .controller('LoginCtrl', function($scope, $location, auth) {

    $scope.user = {};

    /* Permet de s'enregister */
    $scope.register = function() {
      auth.register($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $location.path('/dashboard');
      });
    };

    /* Permet de se logger */
    $scope.logIn = function() {
      auth.logIn($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $location.path('/dashboard');
      });
    };

  });
