angular.module('app')

  // Mensagens de erros do firebase
  .constant('ERRORCODES', {
    AUTH_REQURIRED: 'Você não está mais autenticado',
    USER_AUTENTICADED: 'Usuário autenticado',
    'There is no user record corresponding to this identifier. The user may have been deleted.':
      'Não há usuários com este email',
    'The password is invalid or the user does not have a password.':
      'Senha e Email inválidos'
  })

  // Valida Permissão
  .factory('PermissionUtils', function (Ref, Auth, $q) {
    /**
     * Verifica se autenticação do usuário
     * @returns {*}
     */
    function requireAuth() {
      return $q(function (resolve, reject) {
        function observer(user) {
          if (user) return resolve(user);
          return reject();
        }

        Auth.onAuthStateChanged(observer);
      });
    }

    /**
     * Retorna uma promessa com o papel do usuário
     * @param auth
     * @returns {*}
     */
    function getRole(auth) {
      return $q(function (resolve, reject) {
        Ref.child('roles').child(auth.uid).once('value', function (snap) {
          if (!snap.val()) return reject();
          return resolve(snap.val() || 'donor');
        });
      });
    }

    function getPermission() {}

    return {
      requireAuth: requireAuth,
      getRole: getRole,
      getPermission: getPermission
    };
  })

  // Permissão do usuário
  .constant('PERMISSION', {
    requireRole: function () {
      return ['PermissionUtils', function (PermissionUtils) {
        return PermissionUtils.requireAuth()
          .then(PermissionUtils.getRole);
      }];
    },
    getCurrentUser: function () {
      return ['PermissionUtils', function (PermissionUtils) {
        return PermissionUtils.requireAuth();
      }];
    }
  });
