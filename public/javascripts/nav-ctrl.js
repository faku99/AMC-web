(function() {
  angular
    .module('AMC-web')
    .controller('NavCtrl', NavCtrl);

  NavCtrl.$inject = ['$scope', 'auth'];

  /*
   * Navigation Controller.
   */
  function NavCtrl($scope, auth) {
    $scope.isLoggedIn = auth.isLoggedIn;
    $scope.currentUser = auth.currentUser;
    $scope.logOut = auth.logOut;
  }

})();
