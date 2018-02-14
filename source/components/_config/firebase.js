angular.module('app')
  // Ref do Firebase
  .factory('Ref', function () { return firebase.database().ref('/');})
  // Firebase Auth
  .factory('Auth', function () {  return firebase.auth(); });
