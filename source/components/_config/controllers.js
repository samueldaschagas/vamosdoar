function MainController($scope, $timeout, $state, Auth) {
  // Observa mudança no estado da autenticação
  Auth.onAuthStateChanged(function (currentUser) {
    // Usuário não autenticado, redirecione para login
    // if (!currentUser) $state.go('account');

    // Atualiza usuário atual
    $timeout(function () {
      $scope.currentUser = currentUser;
    });
  });

  /**
   * Sair do sistema
   */
  $scope.logout = function () { Auth.signOut(); };
}

angular.module('app').controller('MainCtrl', MainController);
