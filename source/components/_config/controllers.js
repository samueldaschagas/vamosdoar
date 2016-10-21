angular.module('app')
  .controller('MainCtrl', function ($scope, Auth, Ref, $mdSidenav, $window, $timeout) {
    // Não podemos usar currentUser ou currentRole pois o sidenav não é uma rota.
    var rolesRef = Ref.child("users/roles");
    var defaultPaymentMethodRef = Ref.child("users/defaultPaymentMethod");

    Auth.onAuthStateChanged(function (currentUser) {
      if (!currentUser) {
        return $window.location.replace('/#/home');
      }

      $timeout(function () {
        $scope.currentUser = currentUser;
      });

      rolesRef.child(currentUser.uid).once("value", function (snap) {
        $timeout(function () {
          $scope.role = snap.val() || "client";
        });
      });

        defaultPaymentMethodRef.child(currentUser.uid).once("value", function (snap) {
        $timeout(function () {
          $scope.defaultPaymentMethod = !!snap.val();
        });
      });

    });

    $scope.logout = function () {
      Auth.signOut();
    };

    $scope.sidenavToggle = function (val) {
      if (val === false) return $mdSidenav('sidenav').close();
      if (val === true) return $mdSidenav('sidenav').open();
      $mdSidenav('sidenav').toggle();
    };

  })
;
