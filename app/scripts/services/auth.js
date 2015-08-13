'use strict';

angular.module('AMC-web')
  .factory('auth', function($http, $window) {
    var auth = {};

    /* Sauvegarde le token de l'utilisateur */
    auth.saveToken = function(token) {
      $window.localStorage['amc-web-token'] = token;
    };

    /* Retourne le token actuel */
    auth.getToken = function() {
      return $window.localStorage['amc-web-token'];
    };

    /* Retourne 'true' si l'utilisateur est loggé, 'false' sinon. */
    auth.isLoggedIn = function() {
      var token = auth.getToken();

      if(token) {
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload.exp > Date.now() / 1000;
      } else {
        return false;
      }
    };

    /* Retourne les informations de l'utilisateur actuel */
    auth.currentUser = function() {
      if(auth.isLoggedIn()) {
        var token = auth.getToken();
        var payload = JSON.parse($window.atob(token.split('.')[1]));

        return payload;
      }
    };

    /* Permet de s'enregister */
    auth.register = function(user) {
      return $http.post('/register', user).success(function(data) {
        auth.saveToken(data.token);
      });
    };

    /* Permet de se logger */
    auth.logIn = function(user) {
      return $http.post('http://localhost:3000/login', user).success(function(data) {
        auth.saveToken(data.token);
      });
    };

    /* Permet de se délogger */
    auth.logOut = function() {
      $window.localStorage.removeItem('amc-web-token');
    };

    return auth;
  });
