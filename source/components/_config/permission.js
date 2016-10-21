angular.module('app')

  // Sistema de redirecionamento ao detectar um erro de Resolve e logout
  .run(function ($rootScope, $window, Ref, notify, $timeout) {
    /* eslint-disable angular/on-watch */
    $rootScope.$on('$stateChangeSuccess', function (event, toState) {
      $rootScope.showBackButton = !!toState.showBackButton;
    });

    $rootScope.$on('$stateChangeError', function (event, ts, tp, fs, fp, error) {
      event.preventDefault();
      if (error) notify(error, 'error');
      $timeout(function () {
        $window.location.replace('/#/home');
      }, 3000);
    });
  })

  .factory('PermissionUtils', function (Ref, Auth, $q) {
    /**
     * Uma promessa que resolve com o auth e falha se o usuário não estiver logado
     * @returns {promise} promise
     */
    function requireAuth() {
      return $q(function (resolve, reject) {
        var unsubscribe;
        unsubscribe = Auth.onAuthStateChanged(observer);
        function observer(user) {
          unsubscribe();
          if (user) return resolve(user);
          reject();
        }
      });
    }

    /**
    * "Desfalha" uma promessa. Retorna false se ela falhar.
    * @param {promise} promise
    * @returns {promise}
    */
    function waitFor(promise) {
      return $q(function (resolve) {
        promise.then(resolve, function () {
          resolve(false);
        });
      });
    }

    /**
     * Retorna uma promessa com o usuário ou não
     * @returns {promise} promise
     */
    function waitForAuth() {
      return waitFor(requireAuth());
    }

    /**
     * Retorna um a promessa com o papel do usuário
     * @param auth
     * @returns {*}
     */
    function getRole(auth) {
      return Ref.child('users/roles/' + auth.uid).once('value')
        .then(function (snap) { return snap.val() || 'client'; });
    }

    /**
     * Retorna uma promessa com o User
     * @param auth
     * @returns {*}
     */
    function getUser(auth) {
      return Ref.child('users/private/' + auth.uid).once('value')
        .then(function (snap) { return snap.val() || $q.reject('NO_USER_FOUND'); });
    }

    /**
     * Retorna uma função que verifica por um papel.
     * @param roles
     * @returns {Function}
     */
    function checkRolesFunction(roles) {
      if (_.isString(roles)) {
        roles = [roles];
      }

      return function (role) {
        return $q(function (resolve, reject) {
          if (!_.includes(roles, role)) return reject();
          resolve(role);
        });
      };
    }

    return {
      requireAuth: requireAuth,
      waitForAuth: waitForAuth,
      waitFor: waitFor,
      getRole: getRole,
      getUser: getUser,
      checkRolesFunction: checkRolesFunction
    };
  })

  .constant('PERMISSION', {
    waitForAuth: ['PermissionUtils', function (PermissionUtils) {
      return PermissionUtils.waitForAuth();
    }],

    requireAuth: ['PermissionUtils', function (PermissionUtils) {
      return PermissionUtils.requireAuth();
    }],

    requireNoAuth: ['PermissionUtils', '$q', function (PermissionUtils, $q) {
      return $q(function (resolve, reject) {
        PermissionUtils.requireAuth()
          .then(function () {
            return reject('USER_IS_AUTHENTICATED');
          }, resolve);
      });
    }],

    waitForUser: ['PermissionUtils', 'Auth', function (PermissionUtils, Auth) {
      return Auth.$requireAuth()
        .then(PermissionUtils.getUser);
    }],

    waitForRole: ['PermissionUtils', 'Auth', function (PermissionUtils) {
      return PermissionUtils.waitFor(
        PermissionUtils.requireAuth()
          .then(PermissionUtils.getRole)
      );
    }],

    requireRole: function (roles) {
      return ['PermissionUtils', function (PermissionUtils) {
        return PermissionUtils.requireAuth()
          .then(PermissionUtils.getRole)
          .then(PermissionUtils.checkRolesFunction(roles));
      }];
    }
  });
