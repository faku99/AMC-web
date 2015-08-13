'use strict';

/**
 * ngdoc
 */

angular.module('AMC-web')
  .factory('questions', function($http, auth) {
    var service = {
      questions: []
    };

    /* Permet d'obtenir toutes les questions */
    service.getAll = function() {
      return $http.get('/questions').success(function(data) {
        angular.copy(data, service.questions);
      });
    };

    /* Permet de créer une question. Utilisée dans MainController. */
    service.create = function(question) {
      return $http.post('/questions', question, {
        headers: { Authorization: 'Bearer ' + auth.getToken() }
      })
      .success(function(data) {
        service.questions.push(data);
      });
    };

    /* Permet de supprimer une question. */
    service.remove = function(question) {
      return $http.put('/questions/' + question._id + '/remove', null, {
        headers: {Authorization: 'Bearer ' + auth.getToken()}
      });
    };

    /* Permet d'obtenir une seule question en fonction de son identifiant */
    service.get = function(id) {
      return $http.get('/questions/' + id)
        .then(function(res) {
          return res.data;
        });
    };

    return service;
  }
);
