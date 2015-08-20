'use strict';

angular.module('AMC-web')

  .controller('DashboardCtrl', [
    '$scope', '$state', 'auth',
    
    function($scope, $state, auth) {

      $scope.currentUser = auth.currentUser;
      $scope.$state = $state;

    }
  ]);
