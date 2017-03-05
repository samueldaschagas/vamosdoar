/**
 * Controle do módulo de autenticação
 * @param $scope
 * @param $state
 * @param $log
 * @param $q
 * @param $stateParams
 * @param $mdToast
 * @param Ref
 * @param Auth
 * @returns {promise|void}
 * @constructor
 */
function AccountController($scope, $state, $log, $q, $stateParams, $mdToast, Ref, Auth) {
  // usuário logado, redireciona para painel
  if (Auth.currentUser) return $state.go('home');

  // Sem estado, redireciona para tela de login
  if (!$stateParams.state) $state.go('account', _.defaults({ state: 'login' }, $stateParams));

  // Objeto do usuário
  $scope.user = { isInstitution: false };

  /**
   * Faz o login do usuário
   * via email e password
   * @returns {*|Promise.<Object>|!firebase.Promise.<!firebase.User>|firebase.Promise<any>|{name, a}}
   */
  function login() {
    return Auth.signInWithEmailAndPassword(
      $scope.user.email,
      $scope.user.password
    );
  }

  /**
   * Cria autenticação do usuário
   * @returns {firebase.Promise<any>|!firebase.Promise.<!firebase.User>|*|Promise.<Object>|{name, a}}
   */
  function createAuth() {
    return Auth.createUserWithEmailAndPassword(
      $scope.user.email,
      $scope.user.password
    );
  }

  /**
   * Cria novo usuário
   * @param newAuth
   * @returns {*}
   */
  function createUser(newAuth) {
    var profileRef = Ref.child('users').child(newAuth.uid);

    function getUser() {
      return $q(function (resolve) {
        profileRef.once('value', function (snap) {
          if (snap.exists() && snap.val()) return resolve(snap.val());
          return resolve(false);
        });
      });
    }

    function createNewUser(existingUser) {
      return $q(function (resolve, reject) {
        var profileInfo = {};
        if (existingUser) return resolve(newAuth);
        profileInfo.email = $scope.user.email;
        profileInfo.isInstitution = $scope.user.isInstitution;
        profileInfo.name = $scope.user.name;

        return profileRef.update(profileInfo, function (err) {
          if (err) return reject(err);
          newAuth.updateProfile({ displayName: profileInfo.name });
          return resolve(newAuth);
        });
      });
    }
    return getUser().then(createNewUser);
  }

  /**
   * Atualiza papel do usuário
   * @param newAuth
   * @returns {*}
   */
  function setRole(newAuth) {
    return $q(function (resolve) {
      var role = $scope.user.isInstitution ? 'institution' : 'donor';
      var roleRef = Ref.child('roles');

      roleRef.child(newAuth.uid).set(role, function () {
        resolve(newAuth);
      });
    });
  }

  /**
   * Redireciona usuário
   */
  function redirect() { $state.go('home'); }

  /**
   * Notifca erro
   * @param err
   */
  function showError(err) {
    $mdToast.show($mdToast.simple().textContent(err.message));
    $log.error(err);
  }

  /**
   * Envia formulário
   * @returns {*}
   */
  $scope.submit = function () {
    if ($stateParams.state === 'login') {
      return login()
        .then(redirect, showError);
    }

    if ($stateParams.state === 'signup') {
      return createAuth()
        .then(login)
        .then(createUser)
        .then(setRole)
        .then(redirect, showError);
    }

    return false;
  };
}

angular.module('app').controller('MainAccount.Controller', AccountController);
