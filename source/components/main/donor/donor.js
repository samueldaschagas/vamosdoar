angular.module("app")
  .controller("Donor.Controller", function ($scope, Auth, $state, $mdDialog, $mdToast, $http, Ref) {

    var mapOptions = {
      zoom: 15,
      center: new google.maps.LatLng(-9.626925, -35.738214200000016),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.today = moment()
      .hours(23)
      .minutes(59)
      .seconds(59)
      .toDate();
    $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
    $scope.geocoder = new google.maps.Geocoder();

  });