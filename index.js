// foursquare: fsq3ZPhkdKKBui78Tqrq5zPG68GyfzMSQ3ZtAPbmcPTZBow=

const TEST_LOCATION = [34.050928644814434, -118.24881163103493];
const LOCATION_CLOSE_TO_TEST_LOCATION = [34.051998644814434, -118.24989163103493];
const YOU_ARE_HERE_MESSAGE = 'You are here!';
const ANOTHER_MARKER_MESSAGE = 'Another marker';

window.onload = (e) => {
   main();
};

const main = async () => {
   theMap.initialize(TEST_LOCATION);
   // theMap.centerToUserPosition();
   theMap.addMarker(TEST_LOCATION, YOU_ARE_HERE_MESSAGE)
   
   buildBusinessTypeDropDownList();

}

const theMap = {
   map,

   initialize: (latLong) => {
      map = L.map('map', {
         center: latLong,
         zoom: 15,
      });

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
         minZoom: '15',
      }).addTo(this.map)
      // console.log(`theMap.initialize() -> location: ${TEST_LOCATION}`);
   },

   addMarker: (latLong, message) => {
      const marker = L.marker(latLong)
      marker.addTo(map)
         .bindPopup(`<p1><b>${message}</b><br/>${latLong}</p1>`)
         .openPopup();
      // console.log(`theMap.addMarker(): ${latLong}; ${message}`);
      return marker;
   },

   centerToPosition: (latLong) => {
      map.panTo(new L.LatLng(latLong[0], latLong[1]));
      // console.log(`theMap.centerToPosition(): ${latLong}`);
   },

   centerToUserPosition: () => {
      navigator.geolocation.getCurrentPosition((userPosition) => {
         latLong = [userPosition.coords.latitude, userPosition.coords.longitude];
         map.panTo(new L.LatLng(userPosition.coords.latitude, userPosition.coords.longitude));
         // console.log(`theMap.centerToUserPosition(): ${latLong}`);
      });

   }
}


const buildBusinessTypeDropDownList = () => {
   const select = document.getElementById("businessType");
   const option0 = document.createElement('option');
   option0.text = '-- find --';
   option0.value = '';
   select.add(option0, 0);

   const option1 = document.createElement('option');
   option1.text = 'coffee shops';
   option1.value = 'coffee'
   select.add(option1, 1);

   const option2 = document.createElement('option');
   option2.text = 'restaurants';
   option2.value = 'restaurants'
   select.add(option2, 2);

   const option3 = document.createElement('option');
   option3.text = 'gas stations';
   option3.value = 'gas'
   select.add(option3, 3);

   const option4 = document.createElement('option');
   option4.text = 'shops';
   option4.value = 'shops'
   select.add(option4, 4);

   select.onchange = businessTypeSelected;

}

const businessTypeSelected = (e) => {
   const target = e.target;
   const selectedValue = target.options[target.selectedIndex].value
   // theMap.centerToPosition(LOCATION_CLOSE_TO_TEST_LOCATION);
   theMap.addMarker(LOCATION_CLOSE_TO_TEST_LOCATION, ANOTHER_MARKER_MESSAGE);
}