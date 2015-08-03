angular.module('AMC-web').factory('questions', [
  '$http', 'auth',
  function($http, auth) {
    var o = {
      questions: []
    };

    o.getAll = function() {
      return $http.get('/questions').success(function(data) {
        angular.copy(data, o.questions);
      });
    };

    o.create = function(question) {
      return $http.post('/questions', question, {
        headers: { Authorization: 'Bearer ' + auth.getToken() }
      }).success(function(data) {
        o.questions.push(data);
      });
    };

    o.get = function(id) {
      return $http.get('/questions/' + id).then(function(res) {
        return res.data;
      });
    };

    return o;
  }
]);
