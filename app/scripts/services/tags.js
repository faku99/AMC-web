'use strict';

/**
 * ngdoc
 */

angular.module('AMC-web')
  .factory('tags', function(auth, requests) {
    var service = {};

    /* On ajoute, s'il n'existe pas déjà, le tag à la base de données */
    service.createTag = function(tag) {
      requests.post('/tags', tag);
    };

    return service;
  }
);
