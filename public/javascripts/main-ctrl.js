(function() {
  angular
    .module('AMC-web')
    .controller('MainCtrl', MainCtrl);

  MainCtrl.$inject = ['$scope', '$http', 'questions', 'auth', 'tags'];

  /*
   * Main Controller.
   */
  function MainCtrl($scope, $http, questions, auth, tags) {
    $scope.questions = questions.questions;
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.tags = [];
    $scope.sortType = 'date';
    $scope.sortReverse = true;
    $scope.searchString = '';

    /* Ajoute une question à la base de données */
    $scope.addQuestion = function() {
      /* On vérifie que le titre n'est pas vide */
      if(!$scope.title || $scope.title === '') { return; }

      /* On crée la question */
      questions.create({
        title: $scope.title,
        author: auth.currentUser().username,
        public: false,
        date: $scope.localeDate(),
        tags: fetchTags($scope.tags)
      });

      /* On remet à zéro les champs */
      $scope.title = '';
      $scope.tags = [];
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

      return day + "/" + month + "/" + year + " à " + hours + ":" + minutes;
    };

    /* Permet de vérifier si un tag existe déjà ou pas.
     * Si ce n'est pas le cas, alors on l'ajoute à la base de données des
     *  tags déjà connus
     */
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

})();
