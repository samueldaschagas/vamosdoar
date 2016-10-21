angular.module('app')
  .controller('LoginAccount.Controller', function ($scope, $state, Auth, $q, Ref, $stateParams, notify, httpPending) {
    // Propriedades do $stateParams:
    // state, role, isPj, email, token, persona

    /**
     * Evento que desabilita app name
     */
    $scope.$on('$viewContentLoaded',  function(event){
      document.getElementById("appName").style.display = "none";
    });

    if (!$stateParams.state)
      $state.go("account", _.defaults({ state:'login' }, $stateParams));

    $scope.$stateParams = $stateParams;

    $scope.user = {
      isPj   : false,
      acceptTerms   : false,
      email  : $stateParams.email,
      role   : $stateParams.role,
      persona: $stateParams.persona,
      token  : $stateParams.token
    };

    // Rede Social
    $scope.oauthLogin = function(provider) {
      Auth.signInWithPopup(provider)
        .then(createUser)
        .then(redirect, showError);
    };

    // Enviar formulário
    $scope.submit = function () {
      httpPending(true);

      if ($stateParams.state === 'login') {
        return login()
          .then(redirect, showError);
      }

      if ($stateParams.state === 'signup') {
        return createAuth()
          .then(login)
          .then(createUser)
          .then(createWelcomeEmailAndCrmTask)
          .then(redirect, showError);
      }

      if ($stateParams.state === 'forgot') {
        return forgot()
          .then(function () {
            notify("Se houver uma conta com este email, você receberá as instruções em alguns instantes.");
          })
          .then(redirect, showError);
      }

      reset()
        .then(function () {
          notify({
            message: "Senha redefinida com sucesso",
            type: 'info'
          });
          $state.reload();
        })
        .then(login)
        .then(redirect, showError);
    };

    // Login
    function login() {
      return Auth.signInWithEmailAndPassword(
        $scope.user.email,
        $scope.user.password
      );
    }

    // Criar conta
    function createAuth () {
      return Auth.createUserWithEmailAndPassword(
        $scope.user.email,
        $scope.user.password
      );
    }

    // Create Profile
    function createUser(newAuth) {

      var profileRef = Ref.child('users/private/'+newAuth.uid);

      return getUser()
        .then(createNewUser);

      // Vamos verificar se o perfil já existe. Quando logamos com rede social, não temos como
      // saber se o usuário está criando uma conta ou só logando
      function getUser () {
        return $q(function(resolve, reject) {
          profileRef.once('value', function (snap) {
            // Retorne o perfil existente
            if (snap.exists() && snap.val())
              return resolve(snap.val());
            // Se rejeitar-mos, não vamos criar o perfil na proxima etapa
            return resolve(false)
          });
        })
      }

      //ToDo 1) adicionar verificação e setar estado do DDD passado
      function createNewUser (existingUser) {
        return $q(function (resolve, reject) {
          // Nosso Usuário já existe, não crie-o
          if (existingUser) return resolve(newAuth);

          // Pegamos os dados do perfil
          var profile = Auth.currentUser;

          var profileInfo = {};

          profileInfo.createdAt = firebase.database.ServerValue.TIMESTAMP;
          profileInfo.updatedAt = firebase.database.ServerValue.TIMESTAMP;

          // Temos que ver, item por item, se há a informação necessária antes de inserir, pois o
          // firebase não permite atualizar resultados nulos. O usuário também poderá desabilitar
          // o compartilhamento de dados específicas na página de autenticação das redes sociais
          var email = profile.email;
          if (email) profileInfo.email = email;

          var profileImageURL = profile.photoURL;
          if (profileImageURL) profileInfo.profileImageURL = profileImageURL;

          var displayName = profile.displayName || $scope.user.displayName;
          if (displayName) profileInfo.displayName = displayName;
          
          profileInfo.origin = "Account";

          // Verifica se usuário é PJ
          if($scope.user.isPj) {
            var company = $scope.user.company;
            if (company) profileInfo.company = company;

            var phoneNumber = $scope.user.phoneNumber;
            if (phoneNumber) profileInfo.phoneNumber = phoneNumber;
          }

          profileRef.update(profileInfo, function (err) {
            if(err) return reject(err);

            // Já que o usuário não tinha perfil, vamos tentar setar um papel também.
            // O não há papel para setar, então já terminamos!
            if (!$scope.user.role || $scope.user.role === 'client') return resolve(newAuth);

            Ref.child('users/roles/'+newAuth.uid).set($scope.user.role, function (err) {
              if(err) return reject(err);
              resolve(newAuth);
            });

          });
        });
      }

    }

    function createWelcomeEmailAndCrmTask(newAuth) {

      // Envie email de boas vindas
      var p1 = Ref.child('jobs/emails/tasks').push({
        uid: newAuth.uid,
        template: "welcome"
      });

      // Sincronize o usuario com o AC
      var p2 = Ref.child('jobs/crm/tasks').push({
        uid: newAuth.uid,
        action: "syncUser"
      });

      return $q.all([p1, p2]);

    }

    function forgot () {
      return Auth.sendPasswordResetEmail($scope.user.email);
    }

    function reset () {
      return Auth.confirmPasswordReset(
        $scope.user.token,
        $scope.user.password
      );
    }

    function redirect () {
      httpPending(false);
      $state.go('home');
    }

    function showError(err) {
      httpPending(false);
      err.type = 'error';
      notify(err);
    }

  })
;
