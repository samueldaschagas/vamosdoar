angular.module('app')

  .config(function ($stateProvider, $urlRouterProvider, PERMISSION) {

    // Estado Inicial
    $urlRouterProvider.otherwise('/home');

    $stateProvider

      // Login
      .state("account", {
        url: '/account?state',
        controller: "LoginAccount.Controller",
        templateUrl: 'account',
        resolve: {
          // Não permite logados entrarem aqui
          noAuth: PERMISSION.requireNoAuth
        }
      })

      .state("home", {
        url: "/home",
        controller: "LoginHome.Controller",
        templateUrl: "home",
        resolve: {
          // Espera pelo papel, mas todos podem entrar.
          currentUserRole: PERMISSION.waitForRole
        }
      });
  });