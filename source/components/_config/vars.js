angular.module("app")
  .constant("TRANSLATIONURL", "https://translation.handtalk.me/")

  .constant("CHARTOPTIONS", {
    scaleShowGridLines: false,
    scaleGridLineWidth: 1,
    scaleShowVerticalLines: false,
    scaleShowHorizontalLines: false,
    bezierCurve: false,
    pointDot: true,
    datasetStrokeWidth: 0.5,
    percentageInnerCutout: 80,
    animationEasing: "easeInOut",
    colours : [
      "#9FA8DA",
      "#FFAB91",
      "#AAAAAA",
      "#F48FB1",
      "#FFF59D",
      "#CE93D8",
      "#E6EE9C"
    ]
  })

  .constant("ERRORCODES", {
    "AUTH_REQURIRED": "Você não está mais autenticado",
    "USER_AUTENTICADED": "Usuário autenticado",
    "There is no user record corresponding to this identifier. The user may have been deleted.":
      "Não há usuários com este email",
    "The password is invalid or the user does not have a password.":
      "Senha e Email inválidos"
  })

  .factory('PermissionUtils', function (Ref, Auth, $q) {

    function requireAuth() {
      return $q(function (resolve, reject) {
        Auth.onAuthStateChanged(observer);
        function observer(user) {
          if (user) return resolve(user);
          reject();
        }
      });
    }

    /**
     * Retorna um a promessa com o papel do usuário
     * @param auth
     * @returns {*}
     */
    function getRole(auth) {
      return $q(function (resolve, reject) {
       Ref.child("roles").child(auth.uid).once("value")
         .then( function (snap) {
           if(!snap.val()) return reject();
           resolve(snap.val() || 'donor');
         });

      });
    }

    function getPermission() {

    }

    return {
      requireAuth: requireAuth,
      getRole: getRole,
      getPermission: getPermission
    };
  })

  .constant("PERMISSION", {
    requireRole: function () {
      return ['PermissionUtils', function (PermissionUtils) {
        return PermissionUtils.requireAuth()
          .then(PermissionUtils.getRole);
      }];
    },
    getCurrentUser: function () {
      return ['PermissionUtils', function (PermissionUtils) {
        return PermissionUtils.requireAuth();
      }]
    }
  })
;