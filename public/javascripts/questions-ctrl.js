angular.module('AMC-web').controller('QuestionsCtrl', [
  '$scope', 'questions', 'question', 'auth',
  function($scope, questions, question, auth) {

    $scope.question = question;
    $scope.isLoggedIn = auth.isLoggedIn;

  }
]);
