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

angular.module('app')
    .config(mainRouteConfig)
    .run( function($rootScope, $location) {
        $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams){ 
            if (toState.url === "/account?state" || (toState.url === "/home" && fromState.url === "/account?state"))
                $rootScope.hasTopbar = false;
            else
                $rootScope.hasTopbar = true;
        })
    });

  
