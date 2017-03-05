function ThemeConfig($mdThemingProvider, $mdDateLocaleProvider) {
  // Tema padrão
  $mdThemingProvider
    .theme('default')
    .primaryPalette('grey')
    .accentPalette('indigo')
    .warnPalette('red');

  // Tema secundário
  $mdThemingProvider
    .theme('reverse')
    .primaryPalette('grey')
    .backgroundPalette('grey')
    .accentPalette('indigo')
    .warnPalette('amber')
    .dark();

  /**
   * Define formato de data
   * @param date
   * @returns {*}
   */
  $mdDateLocaleProvider.formatDate = function (date) {
    return moment(date).format('DD/MM/YY');
  };
}

angular.module('app').config(ThemeConfig);
