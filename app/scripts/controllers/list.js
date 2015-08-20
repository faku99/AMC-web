'use strict';

angular.module('AMC-web')

  .controller('ListCtrl', [
    '$scope', 'questions',

    function($scope, questions) {

      $scope.questions = questions.questions;

      $scope.sortType = 'cDate';
      $scope.sortReverse = true;
      $scope.searchString = '';

      $scope.removeQuestion = function(question) {
        questions.remove(question);

        var index = $scope.questions.indexOf(question);

        if (index > -1) {
          $scope.questions.splice(index, 1);
        }
      };

      /**
       * Filtre utilisé lors de la recherche.
       */
      $scope.searchFilter = function(obj) {
        var filter = new RegExp($scope.searchString, 'i');

        return !$scope.searchString || filter.test(obj.title) ||
          filter.test(obj.tags) || filter.test(obj.plainDate) ||
          filter.test(obj.type);
      };

    }
  ]);
