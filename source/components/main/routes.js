angular.module("app")

  .config(function ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/account");

    $stateProvider

      .state("account", {
        url: "/account?state",
        controller: "MainAccount.Controller",
        templateUrl: "account"
      })

      .state("panel", {
        url: "/panel",
        controller: "MainPanel.Controller",
        templateUrl: "panel"
      });
  });