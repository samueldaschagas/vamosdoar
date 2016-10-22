angular.module("app")
  .controller("MainPanel.Controller", function ($scope, Auth, $state, Ref) {
    var mapOptions = {
      zoom: 15,
      center: new google.maps.LatLng(-9.626925, -35.738214200000016),
      mapTypeId: google.maps.MapTypeId.TERRAIN
    };

    $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.geocoder = new google.maps.Geocoder();

    $scope.markers = [];

    var infoWindow = new google.maps.InfoWindow();

    var createMarker = function (info){

      var marker = new google.maps.Marker({
        map: $scope.map,
        position: new google.maps.LatLng(info.lat, info.long),
        title: info.category
      });
      marker.content = '<div class="infoWindowContent"><strong>Doador:</strong> '+ info.name + '<br> <strong>Quantidade:</strong> '+ info.amount+' </div><button class="md-raised md-primary md-button md-ink-ripple btn-interest" ng-click="setInteresse(marker)">Tenho Interesse</button>';

      google.maps.event.addListener(marker, 'click', function(){

        if(marker.title == "Alimentos"){
            marker.icon = "restaurant";
        } else if(marker.title == "Brinquedos") {
            marker.icon = "child_care";
        } else if(marker.title == "Roupas") {
            marker.icon = "person";
        } else {
            marker.icon = "beenhere";
        }
            
        infoWindow.setContent('<h2 class="box-marker"><i class="material-icons icon-' + marker.icon + '">' + marker.icon + '</i> ' + marker.title + '</h2>' + marker.content);
        infoWindow.open($scope.map, marker);
      });

      $scope.markers.push(marker);

    };

    var donationsRef = Ref.child("donations");

    donationsRef.on("child_added", function (snap) {
      console.log("snap: ", snap.val());
      var donation = snap.val();
      donation.key = snap.key;
      createMarker(donation);
    });

    $scope.openInfoWindow = function(e, selectedMarker){
      e.preventDefault();
      google.maps.event.trigger(selectedMarker, 'click');
    };

     $scope.getAddress = function () {
      $scope.geocoder.geocode( { 'address': $scope.address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          console.log("Latitude: ", results[0].geometry.location.lat());
          console.log("Logitude: ", results[0].geometry.location.lng());
          $scope.map.setCenter(results[0].geometry.location);
        } else alert('Geocode was not successful for the following reason: ' + status);
      });
    };

    $scope.getInteresse = function (item) {
      console.log(item);
    };


  });
