function Utils($rootScope, $stateParams, $state, $mdDialog, $window, $mdMedia) {
  // Disponibilizar elementos nos templates
  $rootScope.dialogHide = $mdDialog.hide;
  $rootScope.dialogCancel = $mdDialog.cancel;
  $rootScope.moment = $window.moment;
  $rootScope._ = $window._;
  $rootScope.$stateParams = $stateParams;
  $rootScope.$mdMedia = $mdMedia;
  $rootScope.$state = $state;
}

angular.module('app').run(Utils);

