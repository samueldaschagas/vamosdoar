angular.module('app')
  .config(function ($mdThemingProvider, $mdDateLocaleProvider) {
    $mdThemingProvider
      .theme('default')
      .primaryPalette('grey')
      .accentPalette('indigo')
      .warnPalette('red');

    $mdThemingProvider
      .theme('reverse')
      .primaryPalette('grey')
      .backgroundPalette('grey')
      .accentPalette('indigo')
      .warnPalette('amber')
      .dark();

    $mdDateLocaleProvider.formatDate = function(date) {
      return moment(date).format('DD/MM/YY');
    };

  });
