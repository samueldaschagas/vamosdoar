angular.module('app')
  .controller('LoginHome.Controller', function ($scope, $rootScope, $state, $window, Auth, currentUserRole) {

    if (!Auth.currentUser)
      return $state.go("account", { state:'login' });

    if (currentUserRole == 'admin')
      return $window.location.href = '/desenv';

    if (currentUserRole == 'interpreter')
      return $window.location.href = '/community';

    return $window.location.href = '/client';

  });
