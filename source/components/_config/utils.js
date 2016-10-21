angular.module('app')
  // Adicionar propriedades no rootScope
  .run(function ($rootScope, $http, $stateParams, $state, $mdDialog, Ref, $timeout, $window,
    $mdMedia) {
    // HtConfig Configurações
    Ref.child('config').on('value', function (snap) {
      $timeout(function () {
        $rootScope.HtConfig = snap.val();
      });
    });

    // Título da barra do navegador
    $rootScope.title = '';

    // Um caractere simples pra indicar pedaços de texto que ainda não foram carregados
    $rootScope.l = '🕑';

    // Botão de voltar
    $rootScope.goBack = function () {
      $window.history.back();
    };

    // httpPending
    var fbPending = false;
    var forceHide = false;

    $rootScope.httpPending = function (fbp, fh) {
      if (fbp || fbp === false) fbPending = fbp;
      if (fh || fh === false) forceHide = fh;
      return !forceHide && (fbPending || $http.pendingRequests.length !== 0);
    };

    $rootScope.defaultUserImage = function (image, encoded) {
      return image || (encoded ?
        '%2F%2Fapi.handtalk.me%2Fpublic%2Fimages%2Fuser%2Fdefault.png' :
        '//api.handtalk.me/public/images/user/default.png');
    };

    // Disponibilizar elementos nos templates
    $rootScope.dialogHide = $mdDialog.hide;
    $rootScope.dialogCancel = $mdDialog.cancel;
    $rootScope.moment = $window.moment;
    $rootScope._ = $window._;
    $rootScope.$stateParams = $stateParams;
    $rootScope.$mdMedia = $mdMedia;
    $rootScope.$state = $state;
  })

  // Factory do httpPending
  .factory('httpPending', function ($rootScope) {
    return $rootScope.httpPending;
  })

  // Criar uma mensagem popup
  .factory('notify', function ($rootScope, $mdToast, $log, ERRORCODES) {
    // Tipos de mensage (igual ao console): Log, Info, Warn, Error
    var DEFAULTS = {
      message: '(sem texto)',
      type: 'log',
      action: null,
      position: 'bottom left'
    };

    function notify(options, type) {
      if (_.isString(options)) {
        options = {
          message: options,
          type: type
        };
      }

      options = _.defaults(options, DEFAULTS);

      // Traduzir mensagens de erro
      if (options.type === 'error') {
        options.message = ERRORCODES[options.message] || options.message;
      }

      var toast = $mdToast.simple()
        .textContent(options.message)
        .action(options.action)
        // No angular novo (1.1.0). Precisa dele para setar a cor!
        // .highlightClass('md-primary')
        // .highlightAction(true)
      ;

      $log[options.type](options.message);
      return $mdToast.show(toast);
    }

    $rootScope.notify = notify;

    return notify;
  })

  // Permitir CORS
  .config(function ($httpProvider) {
    $httpProvider.defaults.useXDomain = true;
    delete $httpProvider.defaults.headers.common['X-Requested-With'];
  })

  // Directive de Imagens dos sinais
  .directive('htSignImage', function () {
    return {
      restrict: 'E',
      scope: {
        signId: '=',
        signSize: '='
      },
      template:
        '<img ng-src="//api.handtalk.me/signs/gifs/{{signId}}.gif" ' +
        'onerror="signImgError(this)" class="{{\'sign-\'+(signSize||\'small\')}}">'
    };
  })

  // Filtro que converte de objeto em array. Se o valor for um objeto, adiciona a chave como 'key'
  .filter('objectToArray', function () {
    return function (items) {
      return _.keys(items || {}).map(function (key) {
        return { key: key, val: items[key] };
      });
    };
  })

  // Converte de centavos para reais
  .filter('centsToReais', function () {
    return function (input, dec) {
      return 'R$ ' + parseFloat(Math.round(parseInt(input, 10)) / 100)
        .toFixed(parseInt(dec || 2, 10));
    };
  })

  // Converte de centavos para reais
  .filter('timestampToDate', function () {
    return function (input, format) {
      return moment(input).format(format);
    };
  })
;

/**
 * Substitui sinal por imagem de erro
 * @param el
 */
// eslint-disable-next-line no-unused-vars
function signImgError(el) {
  el.onerror = '';
  el.src = '/images/hugo/hugo-erro500.png';
}
