angular.module('app')

  .config(function ($stateProvider, $urlRouterProvider, PERMISSION) {

    // Estado Inicial
    $urlRouterProvider.otherwise('/home');

    $stateProvider

      // Login
      .state("account", {
        url: '/account?state&role&isPj&email&token&persona',
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
      })

      .state("profile", {
        url: "/profile",
        controller: "LoginProfile.Controller",
        templateUrl: "profile",
        resolve: {
          // Auth obrigatório
          currentAuth: PERMISSION.requireAuth
        }
      })

      .state("translate", {
        url: "/translate",
        controller: "TranslateCtrl",
        templateUrl: "translate",
        data: { appName: "Tradutor" }
      })

      .state("paymentmethods", {
        url: "/paymentmethods?htsite&plan&partner",
        controller: "LoginPaymentmethods.Controller",
        templateUrl: "paymentmethods",
        resolve: {
          // Auth obrigatório
          currentAuth: PERMISSION.requireAuth
        }
      })

      .state("invoices", {
        url: "/invoices",
        controller: "LoginInvoices.Controller",
        templateUrl: "invoices",
        resolve: {
          // Auth obrigatório
          currentAuth: PERMISSION.requireAuth
        }
      })

      .state("support", {
        url: '/support',
        controller: 'LoginSupport.Controller',
        templateUrl: 'support',
        showBackButton: true,
        resolve: {
          currentUser: PERMISSION.requireAuth
        }
      });
  });