/**
 * Main controller
 */
angular.module('AMC-web').controller('MainCtrl', [
  '$scope', 'questions', 'auth',
  function($scope, questions, auth) {

    $scope.questions = questions.questions;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;

    $scope.addQuestion = function() {
      if(!$scope.title || $scope.title === '') { return; }

      questions.create({
        title: $scope.title,
        author: auth.currentUser().username,
        public: false
      });
      $scope.title = '';
    };

    $scope.createSeparator = function(index) {
      var show = (index != $scope.questions.length - 1);

      return show;
    }
  }
]);
