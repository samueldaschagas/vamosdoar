angular.module("app")
  .controller("Home.Controller", function ($scope, $rootScope, $state, $window, Auth, $timeout, currentUserRole) {

    if (!Auth.currentUser)
      return $state.go("account", { state: "login" });

    if (currentUserRole == "donor")
      return $state.go("panel");

    if (currentUserRole == "institution")
      return $state.go("panel");

    return $window.location.href = "/client";


  });