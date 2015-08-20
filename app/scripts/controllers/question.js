'use strict';

angular.module('AMC-web')

  .controller('QuestionCtrl',
    // 'question' is the resolve object. See ../app.js
    function($location, $scope, prompt, question, questions, requests, tags) {
      $scope.question = question;

      $scope.answer = {
        title   : '',
        correct : false,
        points  : 0
      };

      $scope.VFAnswer = question.answers[0].correct ? true : false;

      $scope.openAnswer = {
        title   : '',
        points  : 0
      };

      $scope.addAnswer = function() {
        if (!$scope.answer.title || $scope.answer.title === '') { return; }

        $scope.question.answers.push($scope.answer);

        if($scope.answer.correct) { $scope.answers.corrects++; }
        else { $scope.answers.incorrects++; }

        $scope.answer = {
          title   : '',
          correct : false
        };
      };

      $scope.addOpenAnswer = function() {
        if (!$scope.openAnswer.title || $scope.openAnswer.title === '') { return; }

        $scope.question.answers.push($scope.openAnswer);
        $scope.openAnswer = {
          title   : '',
          points  : 0
        };
      };

      $scope.deleteAnswer = function(index) {
        if($scope.question.answers[index].correct) { $scope.answers.corrects--; }
        else { $scope.answers.incorrects--; }

        $scope.question.answers.splice(index, 1);
      };

      $scope.deleteQuestion = function() {
        prompt({
          title   : 'Supprimer la question',
          message : 'Êtes-vous sûr de vouloir supprimer la question \'' + $scope.question.title + '\' ?',
          buttons : [
            { label: 'Supprimer', class: 'btn-danger', primary: true},
            { label: 'Annuler', cancel: true}
          ]
        }).then(function() {
          questions.remove($scope.question).then(function() {
            $scope.successMessage = 'La question a été supprimée.';
          }, function() {
            $scope.errorMessage = 'Une erreur est survenue.';
          });
          $location.path('/dashboard/list');
        });
      };

      $scope.editQuestion = function() {
        $scope.question.answers = $scope.question.type === 'Vrai/Faux' ? createVFAnswers() : $scope.question.answers;
        $scope.question.tags = createTags();

        questions.edit($scope.question).then(function() {
          $scope.successMessage = 'La question a été modifiée.';
        }, function() {
          $scope.errorMessage = 'Une erreur est survenue.';
        });
      };

      $scope.getCorrect = function() {
        return $scope.answer.correct ? 'Juste' : 'Fausse';
      };

      $scope.loadTags = function(query) {
        return requests.get('/tags?q=' + query);
      };

      $scope.showButton = function() {
        var titleType = !$scope.question.title || !$scope.question.type;

        if($scope.question.type === 'QCM') {
          var answers = $scope.answers.corrects > 0 && $scope.answers.incorrects > 0;

          return titleType || !answers;
        }
        else if($scope.question.type === 'Vrai/Faux') {
          return titleType || (typeof $scope.VFAnswer === 'undefined');
        }
        else {
          return titleType;
        }
      };

      /* Permet de vérifier si un tag existe déjà ou pas.
       * Si ce n'est pas le cas, alors on l'ajoute à la base de données des
       *  tags déjà connus
       */
      function createTags() {
        var toReturn = [];

        for (var i in $scope.question.tags) {
          var currentTag = $scope.question.tags[i];

          tags.createTag(currentTag);
          toReturn.push(currentTag.name);
        }

        return toReturn;
      }

      function createVFAnswers() {
        var trueAnswer = {title: 'Vrai'};
        var falseAnswer = {title: 'Faux'};
        var toReturn = [];

        trueAnswer.correct = $scope.VFAnswer;
        falseAnswer.correct = !$scope.VFAnswer;
        toReturn.push(trueAnswer);
        toReturn.push(falseAnswer);

        return toReturn;
      }

      function getStats() {
        var toReturn = {
          corrects  : 0,
          incorrects: 0
        };

        for (var i in $scope.question.answers) {
          if($scope.question.answers[i].correct) { toReturn.corrects++; }
          else { toReturn.incorrects++; }
        }

        return toReturn;
      }

      $scope.answers = getStats();

    }
  );
