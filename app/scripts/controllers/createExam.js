'use strict';

angular.module('AMC-web')

  .controller('CreateExamCtrl',

  function($filter, $scope, datepickerPopupConfig, questions, requests) {
    $scope.collapse = true;

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

    $scope.exam = {
      rules     : 'Aucun document n\'est autorisé.\nL\'usage de la calculatrice est interdit.\nIl n\'y a qu\'une seule bonne réponse par question.',
      questions : [],
    };

    $scope.types = ['Simple', 'Réponses séparées'];

    $scope.getDescription = function(type) {
      var simpleDesc = 'Examen classique.';
      var separateDesc = 'Examen classique avec feuille de réponses séparée.';

      return type === 'Simple' ? simpleDesc : separateDesc;
    };

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

    $scope.submit = function() {
      $scope.exam.questions = selectedAnswers();
      requests.post('/exam/simple.tex', $scope.exam).then(function(result) {
        $scope.texFile = result.data;
        $scope.successMessage = 'L\'examen a été créé avec succès.';
        $scope.exam = {
          rules     : 'Aucun document n\'est autorisé.\nL\'usage de la calculatrice est interdit.\nIl n\'y a qu\'une seule bonne réponse par question.',
          questions : [],
        };
      }, function(err) {
        $scope.errorMessage = 'Une erreur est survenue.';
        console.log('An error occured :', err);
      });
    };

    $scope.download = function() {
      var anchor = angular.element('<a/>');
      anchor.attr({
        href      : 'data:attachment/text;charset-utf-8,' + encodeURI($scope.texFile),
        target    : '_blank',
        download  : 'examen.tex'  //TODO: Changer le nom du fichier en fonction de l'examen
      })[0].click();
    };

    function selectedAnswers() {
      var toReturn = [];
      for (var i in $scope.questions) {
        if($scope.questions[i].selected) {
          toReturn.push($scope.questions[i]);
        }
      }

      return toReturn;
    }

    datepickerPopupConfig.currentText = 'Aujourd\'hui';
    datepickerPopupConfig.clearText = 'Effacer';
    datepickerPopupConfig.closeText = 'Fermer';
});
