/**
 * Configuração de rotas
 * @param $stateProvider
 * @param $urlRouterProvider
 * @param PERMISSION
 */
function mainRouteConfig($stateProvider, $urlRouterProvider, PERMISSION) {
  // Rota inicial
  $urlRouterProvider.otherwise('/home');

  $stateProvider
    // Home
    .state('home', {
      url: '/home',
      controller: 'Home.Controller',
      templateUrl: 'home',
      resolve: {
        currentUserRole: PERMISSION.requireRole()
      }
    })
    // Contas
    .state('account', {
      url: '/account?state',
      controller: 'MainAccount.Controller',
      templateUrl: 'account'
    })
    // Painel da instituição
    .state('panel', {
      url: '/instituicao',
      controller: 'MainPanel.Controller',
      templateUrl: 'panel'
    })
    // Painel do doador
    .state('donor', {
      url: '/doador',
      controller: 'Donor.Controller',
      templateUrl: 'donor',
      resolve: {
        currentUser: PERMISSION.getCurrentUser()
      }
    });
}

angular.module('app').config(mainRouteConfig);
