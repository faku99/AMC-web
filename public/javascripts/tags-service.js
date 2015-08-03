angular.module('AMC-web').factory('tags', [
  '$http', 'auth',
  function($http, auth) {
    var o = {
      allTags: [],
      currentTag: {}
    };

    $http.get('/tags').success(function(data) {
      for(var i in data) {
        o.allTags[i] = data[i].name;
      }
    });

    o.createTag = function(tag) {
      var tagExists = (o.allTags.indexOf(tag.name) > -1);

      if(!tagExists) {
        $http.post('/tags', tag, {
          headers: { Authorization: 'Bearer ' + auth.getToken() }
        });
      }
    };

    return o;
  }
]);
