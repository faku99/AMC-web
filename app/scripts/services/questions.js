'use strict';

/**
 * ngdoc
 */

angular.module('AMC-web')
  .factory('questions', function(auth, requests) {
    var service = {
      questions: []
    };

    /* Permet de créer une question. Utilisée dans MainController. */
    service.create = function(question) {
      return requests.post('/question/create', question).then(
        function(result) {
          service.questions.push(result.data);
        }
      );
    };

    service.edit = function(question) {
      return requests.post('/question/edit', question);
    };

    /* Permet d'obtenir une seule question en fonction de son identifiant */
    service.get = function(id) {
      return requests.get('/question/' + id).then(
        function(result) {
          return result.data;
        }
      );
    };

    /* Permet d'obtenir toutes les questions */
    service.getAll = function() {
      return requests.get('/question/all').then(
        function(result) {
          angular.copy(result.data, service.questions);
        }
      );
    };

    /* Permet de supprimer une question. */
    service.remove = function(question) {
      return requests.put('/question/' + question._id + '/remove');
    };

    return service;
  }
);
