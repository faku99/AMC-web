'use strict';

angular.module('AMC-web')

  .controller('AuthCtrl', [
    '$location', '$scope', 'auth',

    function($location, $scope, auth) {

      $scope.user = {};

      /* Permet de s'enregister */
      $scope.register = function() {
        auth.register($scope.user).then(
          function() {
            $location.path('/dashboard');
          },
          function(error) {
            $scope.error = error.data;
          }
        );
      };

      /* Permet de se logger */
      $scope.logIn = function() {
        auth.logIn($scope.user).then(
          function() {
            $location.path('/dashboard');
          },
          function(error) {
            $scope.error = error.data;
          }
        );
      };

    }
  ]);
