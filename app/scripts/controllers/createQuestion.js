'use strict';

angular.module('AMC-web')

  .controller('CreateQuestionCtrl', [
    '$scope', 'auth', 'questions', 'requests', 'tags',

    function($scope, auth, questions, requests, tags) {

      $scope.answer = {
        title   : '',
        correct : true,
        points  : 0
      };

      $scope.answers = {
        corrects  : 0,
        incorrects: 0
      };

      $scope.openAnswer = {
        title   : '',
        points  : 0
      };

      $scope.openAnswers = [
        {
          title   : 'Réponse fausse',
          points  : 0
        },
        {
          title   : 'Réponse partielle',
          points  : 1
        },
        {
          title   : 'Réponse juste',
          points  : 3
        }
      ];

      $scope.question = {
        answers : []
      };

      $scope.questionTypes = ['QCM', 'Vrai/Faux', 'Question ouverte'];

      $scope.someScopeValue = 15;
      $scope.someOtherScopeValue = 20;

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

        $scope.openAnswers.push($scope.openAnswer);
        $scope.openAnswer = {
          title   : '',
          points  : 0
        };
      };

      $scope.createQuestion = function() {
        $scope.question.tags = createTags();
        $scope.question.answers = answers();

        questions.create($scope.question).then(function() {
          $scope.successMessage = 'La question a bien été créée.';
          $scope.question = { answers: [] };
          $scope.answers = {
            corrects  : 0,
            incorrects: 0
          };
          reinitOpenAnswers();
          $scope.VFAnswer = null;
        }, function(err) {
          console.log('error :', err);
          $scope.error = err.data;
        });
      };

      $scope.deleteAnswer = function(index) {
        if($scope.question.answers[index].correct) { $scope.answers.corrects--; }
        else { $scope.answers.incorrects--; }

        $scope.question.answers.splice(index, 1);
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

      function answers() {
        if($scope.question.type === 'QCM') { return $scope.question.answers; }
        else if ($scope.question.type === 'Vrai/Faux') { return createVFAnswers(); }
        else { return $scope.openAnswers; }
      }

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

      function reinitOpenAnswers() {
        $scope.openAnswers = [
          {
            title   : 'Réponse fausse',
            points  : 0
          },
          {
            title   : 'Réponse partielle',
            points  : 1
          },
          {
            title   : 'Réponse juste',
            points  : 3
          }
        ];
      }

    }
  ]);
