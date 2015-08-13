'use strict';

/**
 * ngdoc
 */

angular.module('AMC-web')
  .controller('MainCtrl', function($scope, $http, questions, auth, tags) {
    $scope.questions = questions.questions;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;

    $scope.tags = [];

    $scope.sortType = 'seconds';
    $scope.sortReverse = true;
    $scope.searchString = '';

    $scope.questionTypes = ['QCM', 'Vrai/Faux', 'Question ouverte'];
    $scope.questionType = '';

    $scope.answers = [];
    $scope.answer = {
      title: '',
      correct: 'Fausse'
    };

    $scope.ddSelectType = function(type) {
      $scope.questionType = type;
    };

    /* Ajoute une question à la base de données */
    $scope.addQuestion = function() {
      /* On crée la question */
      questions.create({
        title: $scope.title,
        author: auth.currentUser().username,
        public: false,
        date: $scope.localeDate(),
        seconds: new Date(),
        tags: fetchTags($scope.tags),
        type: $scope.questionType,
        answers: getAnswers($scope.answers),
        corrects: correctAnswers($scope.answers)
      }).error(function(error) {
        $scope.error = error;
      });

      /* On remet à zéro les champs */
      $scope.title = '';
      $scope.tags = [];
      $scope.answers = [];
    };

    $scope.addAnswer = function() {
      if(!$scope.answer.title || $scope.answer.title === '') { return; }

      $scope.answers.push($scope.answer);
      $scope.answer = {
        title: '',
        correct: 'Fausse'
      };
    };

    $scope.removeQuestion = function(question) {
      questions.remove(question);

      var index = $scope.questions.indexOf(question);

      if(index > -1) {
        $scope.questions.splice(index, 1);
      }
    };

    /* Charge tous les tags connus. Nécessaire à l'auto-completion */
    $scope.loadTags = function(query) {
      return $http.get('/tags/' + query);
    };

    /* Retourne une date lisible par l'utilisateur */
    $scope.localeDate = function() {
      var date = new Date();
      var day = ('0' + date.getDate()).slice(-2);
      var month = ('0' + (date.getMonth() + 1)).slice(-2);
      var year = date.getFullYear();
      var hours = ('0' + date.getHours()).slice(-2);
      var minutes = ('0' + date.getMinutes()).slice(-2);

      return day + '/' + month + '/' + year + ' à ' + hours + ':' + minutes;
    };

    /* Filtre utilisé lors de la recherche. On décide d'omettre la recherche par
     *  auteur et par secondes écoulées après le 1 janvier 1970.
     */
    $scope.searchFilter = function(obj) {
      var filter = new RegExp($scope.searchString, 'i');

      return !$scope.searchString || filter.test(obj.title) ||
        filter.test(obj.tags) || filter.test(obj.date) ||
        filter.test(obj.type);
    };

    /* Permet de vérifier si un tag existe déjà ou pas.
     * Si ce n'est pas le cas, alors on l'ajoute à la base de données des
     *  tags déjà connus
     */
    function fetchTags(qTags) {
      var toReturn = [];

      for(var i in qTags) {
        var currentTag = qTags[i];

        tags.createTag(currentTag);
        toReturn.push(currentTag.name);
      }

      return toReturn;
    }

    function getAnswers() {
      var toReturn = [];

      if($scope.questionType === 'Vrai/Faux') {
        toReturn.push('Vrai');
        toReturn.push('Faux');
      }
      else if($scope.questionType === 'QCM') {
        for(var i in $scope.answers) {
          toReturn.push($scope.answers[i].title);
        }
      }

      return toReturn;
    }

    function correctAnswers(qAnswers) {
      var toReturn = [];

      if($scope.questionType === 'Vrai/Faux') {
        toReturn.push($scope.vfAnswer);
      }
      else if($scope.questionType === 'QCM') {
        for(var i in qAnswers) {
          var currentAnswer = qAnswers[i];

          if(currentAnswer.correct === 'Juste') {
            toReturn.push(i);
          }
        }
      }

      return toReturn;
    }

    $(':input').not('textarea').not('button').keypress(function(event) { return event.keyCode !== 13; });
  }
);
