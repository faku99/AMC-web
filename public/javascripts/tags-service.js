(function() {
  angular
    .module('AMC-web')
    .factory('tags', Tags);

  Tags.$inject = ['$http', 'auth'];

  /*
   * Tags Service.
   */
  function Tags($http, auth) {
    var service = {
      allTags: []
    };

    /* On initialise service.allTags dès l'appel du service */
    $http.get('/tags').success(function(data) {
      for(var i in data) {
        service.allTags[i] = data[i].name;
      }
    });

    /* On ajoute, s'il n'existe pas déjà, le tag à la base de données */
    service.createTag = function(tag) {
      var tagExists = (service.allTags.indexOf(tag.name) > -1);

      if(!tagExists) {
        $http.post('/tags', tag, {
          headers: { Authorization: 'Bearer ' + auth.getToken() }
        });
      }
    };

    return service;
  }

})();
