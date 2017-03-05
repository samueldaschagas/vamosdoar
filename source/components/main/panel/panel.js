/**
 * Controle painel principal
 * @param $scope
 * @param $state
 * @param $http
 * @param $timeout
 * @param $mdDialog
 * @param $mdToast
 * @param Ref
 */
function mainPainelController($scope, $state, $http, $timeout, $log, $mdDialog, $mdToast, Ref, Auth) {
  // Janela de informação do google maps
  var infoWindow = new google.maps.InfoWindow();
  // Ref - ToDo criar service
  var donationsRef = Ref.child('donations');
  // Configurações do mapa
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(-9.626925, -35.738214200000016),
    mapTypeId: google.maps.MapTypeId.TERRAIN
  };

  // Dia atual
  $scope.today = moment()
    .hours(23)
    .minutes(59)
    .seconds(59)
    .toDate();
  // Google Maps
  $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
  // Geolocalização
  $scope.geocoder = new google.maps.Geocoder();
  // Marcadores do mapa
  $scope.markers = [];
  // Categorias - ToDo criar constantes angular
  $scope.categories = ['Alimentos', 'Brinquedos', 'Roupas', 'Outras'];

  /**
   * Cria marcação no mapa
   * @param info
   */
  function createMarker(info) {
    // Ponto de marcação
    var marker = new google.maps.Marker({
      map: $scope.map,
      position: new google.maps.LatLng(info.lat, info.long),
      title: info.category
    });

    // Contéudo da marcação
    marker.content = '<div class="infoWindowContent">' +
      '<strong>Doador:</strong> ' + info.name + '<br> ' +
      '<strong>Quantidade:</strong> ' + info.amount + ' </div>' +
      '<button class="md-raised md-primary md-button md-ink-ripple btn-interest" ' +
      'ng-click="setInteresse(marker)">Tenho Interesse</button>';

    // Adiciona evento de clique no marcador
    google.maps.event.addListener(marker, 'click', function () {
      if (marker.title === 'Alimentos') marker.icon = 'restaurant';
      else if (marker.title === 'Brinquedos') marker.icon = 'child_care';
      else if (marker.title === 'Roupas') marker.icon = 'person';
      else marker.icon = 'beenhere';

      infoWindow.setContent('<h2 class="box-marker">' +
        '<i class="material-icons icon-' + marker.icon + '">' + marker.icon + '' +
        '</i> ' + marker.title + '</h2>' + marker.content);
      infoWindow.open($scope.map, marker);
    });

    // Adiciona ponto de marcação na lista de marcadores
    $scope.markers.push(marker);
  }

  // ToDo - implementar função para agendar doação
  function createScheduled() { }

  /**
   * Abre a janela de informação do marcador
   * @param e
   * @param selectedMarker
   */
  $scope.openInfoWindow = function (e, selectedMarker) {
    e.preventDefault();
    google.maps.event.trigger(selectedMarker, 'click');
  };

  /**
   * Consulta endereço
   * ToDo - Criar factory para busca de endereço
   */
  $scope.getAddress = function () {
    $scope.geocoder.geocode({ address: $scope.address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        $scope.map.setCenter(results[0].geometry.location);
      } else $log.log('Geocode was not successful for the following reason: ' + status);
    });
  };

  /**
   * Marca o interesse da instituição pelo doador
   * @param item
   */
  $scope.getInteresse = function (item) { $log.log(item); };

  $scope.getAddressByCEP = function () {
    // Cep
    var cep = $scope.new.cep ? $scope.new.cep.replace(/-|\s/g, '') : undefined;

    if (cep && cep.length > 7) {
      // ToDo - adicionar url em constante angular
      $http.get('https://viacep.com.br/ws/' + $scope.new.cep + '/json/')
        .success(function (response) {
          if (response.logradouro) $scope.new.address = response.logradouro;
          if (response.bairro) $scope.new.address += (', ' + response.bairro);
          if (response.localidade) $scope.new.address += (', ' + response.localidade);
          if (response.uf) $scope.new.address += (', ' + response.uf);
        })
        .error(function () {
          $mdToast.show($mdToast.simple().textContent('CEP não encontrado'));
          $scope.new.address = '';
        });
    } else $scope.new.address = '';
  };

  /**
   * Cria doação
   */
  $scope.createDonation = function () {
    // Nova doação
    var donation = donationsRef.push();

    $scope.geocoder.geocode({ address: $scope.new.address }, function (results, status) {
      if (status === google.maps.GeocoderStatus.OK) {
        $scope.new.lat = results[0].geometry.location.lat();
        $scope.new.long = results[0].geometry.location.lng();
        $scope.map.setCenter(results[0].geometry.location);

        $scope.new.uid = Auth.currentUser.uid;
        $scope.new.name = Auth.currentUser.displayName;

        donation.set($scope.new);
      }
    });
  };

  /**
   * Abre modal para nova doação
   */
  $scope.newDonation = function () {
    $mdDialog.show({
      preserveScope: true,
      scope: $scope,
      templateUrl: 'newDonation',
      clickOutsideToClose: true,
      fullscreen: false
    }).then(function (type) {
      if (type === 'donation') $scope.createDonation();
    });
  };

  /**
   * Abre modal para agendamento de doação
   * @param marker
   */
  $scope.newScheduled = function (marker) {
    $log.log(marker);

    $mdDialog.show({
      preserveScope: true,
      scope: $scope,
      templateUrl: 'newScheduled',
      clickOutsideToClose: true,
      fullscreen: false
    }).then(function (type) {
      if (type === 'scheduled') createScheduled();
    });
  };

  // Evento para identificar o usuário atual
  Auth.onAuthStateChanged(function (user) {
    if (user) {
      $timeout(function () {
        donationsRef.on('child_added', function (snap) {
          var donation = snap.val();
          donation.key = snap.key;
          createMarker(donation);
        });
      });
    } else {
      // ToDo - Pensar o que fazer aqui (melhor opção redirecionar para o login)
      $log.log('Não autorizado');
      $timeout($state.go('account', { state: 'login' }));
    }
  });
}

angular.module('app').controller('MainPanel.Controller', mainPainelController);
