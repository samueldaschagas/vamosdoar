/**
 * Controle de redirecionamento de usuário
 * @param $state
 * @param Auth
 * @param currentUserRole
 * @returns {promise|void}
 * @constructor
 */
function HomeController($state, Auth, currentUserRole) {
  // Usuário não autenticado, redirecione para o login
  if (!Auth.currentUser) return $state.go('account', { state: 'login' });

  // Doador, redirecione para o painel do doador
  if (currentUserRole === 'donor') return $state.go('donor');

  // Instituição, redirecione para o painel da instituição
  if (currentUserRole === 'institution') return $state.go('panel');

  // Outros casos, redirecione para o login
  return $state.go('account', { state: 'login' });
}

angular.module('app').controller('Home.Controller', HomeController);
