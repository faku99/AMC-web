'use strict';

/**
 * ngdoc
 */

angular.module('AMC-web')
  .factory('requests', function($http, auth) {

    var service = {};

    var headers = {
      headers: {Authorization: 'Bearer ' + auth.getToken()}
    };

    service.post = function(url, object) {
      return $http.post(url, object, headers);
    };

    service.get = function(url) {
      return $http.get(url, headers);
    };

    service.put = function(url) {
      return $http.put(url, null, headers);
    };

    return service;

  });
