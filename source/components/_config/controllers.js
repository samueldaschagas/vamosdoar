angular.module('app')
  .controller('MainCtrl', function ($scope, Auth, Ref, $mdSidenav, $window, $timeout, $state) {

    Auth.onAuthStateChanged(function (currentUser) {
      if (!currentUser) $state.go("account");

      $timeout(function () {
        $scope.currentUser = currentUser;
      });
    });

    $scope.logout = function () {
      Auth.signOut();
    };

  })
;
