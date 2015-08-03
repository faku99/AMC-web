/**
 * Main controller
 */
angular.module('AMC-web').controller('MainCtrl', [
  '$scope', '$http', 'questions', 'auth', 'tags',
  function($scope, $http, questions, auth, tags) {

    $scope.questions = questions.questions;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.tags = [];

    $scope.addQuestion = function() {
      if(!$scope.title || $scope.title === '') { return; }

      questions.create({
        title: $scope.title,
        author: auth.currentUser().username,
        public: false,
        tags: fetchTags($scope.tags)
      });
      $scope.title = '';
      $scope.tags = [];
    };

    $scope.createSeparator = function(index) {
      var show = (index != $scope.questions.length - 1);

      return show;
    };

    $scope.loadTags = function(query) {
      return $http.get('/tags/' + query);
    };

    function fetchTags(tagsArray) {
      var toReturn = [];

      for(var i in tagsArray) {
        var currentTag = tagsArray[i];

        tags.createTag(currentTag);
        toReturn.push(currentTag.name);
      }

      return toReturn;
    }
  }
]);
