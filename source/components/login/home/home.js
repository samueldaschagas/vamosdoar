angular.module('app')
  .controller('LoginHome.Controller', function ($scope, $rootScope, $state, $window, Auth, currentUserRole) {

    if (!Auth.currentUser)
      return $state.go("account", { state:'login' });

    return $window.location.href = '/panel';

  });
