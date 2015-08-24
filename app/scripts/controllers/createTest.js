'use strict';

angular.module('AMC-web')

  .controller('CreateTestCtrl',

  function($filter, $scope, datepickerPopupConfig, questions) {

    $scope.datePicker = {
      minDate     : new Date(),
      opened      : false,
      disabled    : function(date, mode) {
        return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
      },
      open        : function(event) {
        event.preventDefault();
        event.stopPropagation();
        $scope.datePicker.opened = true;
      },
      dateOptions : {
        startingDay: 1
      }
    };

    $scope.questions = questions.questions;

    $scope.filter = $filter('filter')($scope.questions, $scope.search, 'strict');

    $scope.test = {
      selected: []
    };

    $scope.open = true;

    $scope.searchResult = function() {
      if(!$scope.search || $scope.search === '') { return '-'; }
      else {
        $scope.filter = $filter('filter')($scope.questions, $scope.search, 'strict');
        return $scope.filter.length;
      }
    };

    $scope.selectAll = function() {
      for (var i in $scope.filter) {
        $scope.filter[i].selected = !$scope.allSelected;
        var index = $scope.questions.indexOf($scope.filter[i]);
        $scope.questions[index].select = !$scope.allSelected;
      }

      $scope.allSelected = !$scope.allSelected;
    };

    $scope.selectedAnswers = function() {
      var toReturn = [];
      for (var i in $scope.questions) {
        $scope.questions[i].selected ? toReturn.push($scope.questions[i]) : null;
      }

      return toReturn;
    };

    $scope.submit = function() {
      console.log('Matière :', $scope.test.matiere);
      console.log('Date :', $scope.test.date);
      console.log('Question selectionnées :', $scope.selectedAnswers());
    };

    datepickerPopupConfig.currentText = 'Aujourd\'hui';
    datepickerPopupConfig.clearText = 'Effacer';
    datepickerPopupConfig.closeText = 'Fermer';
});
