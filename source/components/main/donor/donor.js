/**
 * Controle do painel doador
 * @param $scope
 * @param Auth
 * @param $state
 * @param $mdDialog
 * @param $mdToast
 * @param $http
 * @param $timeout
 * @param $log
 * @param Ref
 * @constructor
 */
function DonorController($scope, Auth, $state, $mdDialog, $mdToast, $http, $timeout, $log, Ref) {
  // Referência das doações
  var donationsRef = Ref.child('donations');

  // Categorias das doações - ToDo Adicionar constante
  $scope.categories = ['Alimentos', 'Brinquedos', 'Roupas', 'Outras'];

  // Flag auxiliar para identificar a ação do modal (edição ou criação)
  $scope.isEdit = false;

  // Geocoder
  $scope.geocoder = new google.maps.Geocoder();

  $scope.donations = {};

  // Estados do Brasil - ToDo Adicionar constante
  $scope.states = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE',
    'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB',
    'PR', 'PE', 'PI', 'RJ', 'RN', 'RO', 'RS', 'RR', 'SC',
    'SE', 'SP', 'TO'];

  /**
   * Consulta todas as doações do usuário
   * @param uid
   */
  $scope.getDonations = function (uid) {
    var query = donationsRef.orderByChild('uid').equalTo(uid);

    function callback(snap) {
      $timeout(function () {
        $scope.donations[snap.key] = snap.val();
      });
    }
    query.on('child_added', callback);
    query.on('child_changed', callback);
  };

  /**
   * Atualiza doção
   * @param key
   */
  $scope.updatedDonation = function (key) {
    donationsRef.child(key).set($scope.new, function () {
      $mdToast.show($mdToast.simple().textContent('Doação atualizada com sucesso'));
    });
  };

  /**
   * Cria doação
   */
  $scope.createDonation = function () {
    // Nova chave
    var donation = donationsRef.push();

    $scope.geocoder.geocode({ address: $scope.new.address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        $scope.new.lat = results[0].geometry.location.lat();
        $scope.new.long = results[0].geometry.location.lng();

        $scope.new.uid = Auth.currentUser.uid;
        $scope.new.name = Auth.currentUser.displayName;

        donation.set($scope.new, function () {
          $mdToast.show($mdToast.simple().textContent('Doação adicionada com sucesso'));
        });
      }
    });
  };

  /**
   * Abre o modal de doação (edição ou adição)
   * @param key
   */
  $scope.openDonationModal = function (key) {
    $mdDialog.show({
      preserveScope: true,
      scope: $scope,
      templateUrl: 'donationModal',
      clickOutsideToClose: true,
      fullscreen: false
    }).then(function (type) {
      if (type === 'add') $scope.createDonation();
      else if (type === 'edit') $scope.updatedDonation(key);
    });
  };

  /**
   * Adiciona uma nova doação
   */
  $scope.addDonation = function () {
    $scope.isEdit = false;
    $scope.openDonationModal();
  };

  $scope.getAddressByCEP = function () {
    var cep = $scope.new.cep ? $scope.new.cep.replace(/-|\s/g, '') : undefined;

    if (cep && cep.length > 7) {
      $http.get('https://viacep.com.br/ws/' + $scope.new.cep + '/json/')
        .success(function (response) {
          if (response.logradouro) $scope.new.address = response.logradouro;
          if (response.bairro) $scope.new.district = response.bairro;
          if (response.localidade) $scope.new.city = response.localidade;
          if (response.uf) $scope.new.uf = response.uf;
        })
        .error(function () {
          $mdToast.show($mdToast.simple().textContent('CEP não encontrado'));
          $scope.new.address = '';
        });
    } else {
      $scope.new.address = '';
    }
  };

  /**
   * Edita dados da doação do usuário
   * @param key
   */
  $scope.editDonation = function (key) {
    var obj = _.cloneDeep($scope.donations);
    $scope.isEdit = true;
    $scope.new = obj[key];
    // ToDo - precisamos salvar esse dado como um inteiro
    $scope.new.amount = parseInt($scope.new.amount, 10);

    $scope.openDonationModal(key);
  };

  // Evento para identificar o usuário atual
  Auth.onAuthStateChanged(function (user) {
    if (user) $timeout($scope.getDonations(user.uid));
    else {
      // ToDo - Pensar o que fazer aqui (melhor opção redirecionar para o login)
      $log.log('Não autorizado');
      $timeout($state.go('account', { state: 'login' }));
    }
  });
}

angular.module('app').controller('Donor.Controller', DonorController);
