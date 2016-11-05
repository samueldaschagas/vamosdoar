angular.module("app")

  .config(function ($stateProvider, $urlRouterProvider, PERMISSION) {

    $urlRouterProvider.otherwise("/home");

    $stateProvider
      .state("home", {
        url: "/home",
        controller: "Home.Controller",
        templateUrl: "home",
        resolve: {
          currentUserRole: PERMISSION.requireRole()
        }
      })

      .state("account", {
        url: "/account?state",
        controller: "MainAccount.Controller",
        templateUrl: "account"
      })

      .state("panel", {
        url: "/panel",
        controller: "MainPanel.Controller",
        templateUrl: "panel"
      })

      .state("donor", {
          url: "/donor",
          controller: "Donor.Controller",
          templateUrl: "donor"
      });
  });