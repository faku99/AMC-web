(function() {
  angular
    .module('AMC-web')
    .controller('AuthCtrl', AuthCtrl);

  AuthCtrl.$inject = ['$scope', '$state', 'auth'];

  /*
   * Authentification Controller.
   */
  function AuthCtrl($scope, $state, auth) {
    $scope.user = {};

    /* Permet de s'enregister */
    $scope.register = function() {
      auth.register($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };

    /* Permet de se logger */
    $scope.logIn = function() {
      auth.logIn($scope.user).error(function(error) {
        $scope.error = error;
      }).then(function() {
        $state.go('home');
      });
    };

  }

})();
