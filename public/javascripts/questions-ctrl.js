(function() {
  angular
    .module('AMC-web')
    .controller('QuestionsCtrl', QuestionsCtrl);

  QuestionsCtrl.$inject = ['$scope', 'questions', 'question', 'auth'];

  function QuestionsCtrl($scope, questions, question, auth) {
    $scope.question = question;
    $scope.isLoggedIn = auth.isLoggedIn;
  }
})();
