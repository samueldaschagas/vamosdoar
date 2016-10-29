angular.module("app")
  // Adicionar propriedades no rootScope
  .run(function ($rootScope, $http, $stateParams, $state, $mdDialog, Ref, $timeout, $window, $mdMedia) {


    // Disponibilizar elementos nos templates
    $rootScope.dialogHide = $mdDialog.hide;
    $rootScope.dialogCancel = $mdDialog.cancel;
    $rootScope.moment = $window.moment;
    $rootScope._ = $window._;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$mdMedia = $mdMedia;
    $rootScope.$state = $state;
  });

