'use strict';

/**
 * ngdoc
 */

angular.module('AMC-web')
  .controller('QuestionsCtrl', function($scope, questions, question, auth) {
    $scope.question = question;
    $scope.isLoggedIn = auth.isLoggedIn;
  });
