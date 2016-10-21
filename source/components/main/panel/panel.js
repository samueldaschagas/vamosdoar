angular.module("app")
  .controller("MainPanel.Controller", function ($scope, Auth, $state) {
    if (!Auth.currentUser) return $state.go("account");

  });
