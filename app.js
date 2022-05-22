

const FOURSQUARE_API_KEY = 
const TEST_LOCATION = [34.050928644814434, -118.24881163103493];
const LOCATION_CLOSE_TO_TEST_LOCATION = [34.051998644814434, -118.24989163103493];
const YOU_ARE_HERE_MESSAGE = 'You are here!';
const MAX_RESULTS = 5;

window.onload = async (e) => {
   await main();
   controls.clearButtonHide();
};

const main = async () => {
   theMap.initialize(TEST_LOCATION);
   // theMap.centerToUserPosition();
   theMap.addMarkerWithPopup(TEST_LOCATION, YOU_ARE_HERE_MESSAGE)

   controls.buildBusinessTypeDropDownList();

}

const theMap = {
   map: {},

   initialize: (latLong) => {
      map = L.map('map', {
         center: latLong,
         zoom: 15,
      });

      L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
         attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
         minZoom: '15',
      }).addTo(this.map)

      this.markers = new Array();

      // console.log(`theMap.initialize() -> location: ${latLong}`);
   },

   addMarkerWithPopup: (latLong, message) => {
      const marker = L.marker(latLong) //{icon: redMarker}
      marker.addTo(this.map)
         .bindPopup(`<p1><b>${message}</b><br/>${latLong}</p1>`)
         .openPopup();
      // console.log(`theMap.addMarker(): ${latLong}; ${message}`);
      return marker;
   },

   addDeleteableMarkerWithPopup: (latLong, message) => {
      const marker = L.marker(latLong, {icon: theMap.redPin});
      marker.addTo(this.map)
         .bindPopup(`<p1><b>${message}</b><br/>${latLong}</p1>`)
         .openPopup();
      this.markers.push(marker);
      return marker;
   },

   redPin : L.icon({
      iconUrl: './assets/images/red-pin.png',
      iconSize: [38, 38],
      iconAnchor: [19, 38]
   }),

   centerToPosition: (latLong) => {
      this.map.panTo(new L.LatLng(latLong[0], latLong[1]));
      // console.log(`theMap.centerToPosition(): ${latLong}`);
   },

   centerToUserPosition: () => {
      navigator.geolocation.getCurrentPosition((userPosition) => {
         let lat = userPosition.coords.latitude;
         let long = userPosition.coords.longitude;
         this.map.panTo(new L.LatLng(lat, long));
         // console.log(`theMap.centerToUserPosition(): ${latLong}`);
      });
   },

   markers: {},

   hasMarkers: () => {
      return this.markers.length > 0;
   },

   removeMarkers: () => {
      this.markers.forEach(marker => this.map.removeLayer(marker));
   }
}

const controls = {
   businessDropDown: document.getElementById('business'),
   radiusDropDown: document.getElementById('radius'),
   clearButton: document.getElementById('clearSearch'),

   clearButtonHide: () => {
      controls.clearButton.style.visibility = 'hidden';
   },

   clearButtonShow: () => {
      controls.clearButton.style.visibility = 'visible';
   },

   buildBusinessTypeDropDownList: () => {
      const business = document.getElementById('business');
   
      const option0 = document.createElement('option');
      option0.text = '- - - - -';
      option0.value = '';
      business.add(option0, 0);
   
      const option1 = document.createElement('option');
      option1.text = 'coffee shops';
      option1.value = 'coffee'
      business.add(option1, 1);
   
      const option2 = document.createElement('option');
      option2.text = 'restaurants';
      option2.value = 'restaurants'
      business.add(option2, 2);
   
      const option3 = document.createElement('option');
      option3.text = 'grocery stores';
      option3.value = 'groceries'
      business.add(option3, 3);
   
      const option4 = document.createElement('option');
      option4.text = 'gifts';
      option4.value = 'gifts'
      business.add(option4, 4);
   
      const option5 = document.createElement('option');
      option5.text = 'bars';
      option5.value = 'bars'
      business.add(option5, 5);
   
      // business.onchange = businessTypeSelected;
   
      const radius = document.getElementById("radius");
   
      const r0 = document.createElement('option');
      r0.text = '1,000 meter';
      r0.value = '1000';
      radius.add(r0, 0);
   
      const r1 = document.createElement('option');
      r1.text = '5,000 meter';
      r1.value = '5000';
      radius.add(r1, 1);
   
      const r2 = document.createElement('option');
      r2.text = '10,000 meter';
      r2.value = '10000';
      radius.add(r2, 2);

   }
}


const search = async () => {
   theMap.removeMarkers();
   controls.clearButtonHide();

   const businessDropDown = document.getElementById('business');
   const selectedBusinessType = businessDropDown.options[businessDropDown.selectedIndex].value

   const radiusDropDown = document.getElementById('radius');
   const selectedRadius = radiusDropDown.options[radiusDropDown.selectedIndex].value
   // theMap.centerToPosition(LOCATION_CLOSE_TO_TEST_LOCATION);
   // theMap.addMarkerWithPopup(LOCATION_CLOSE_TO_TEST_LOCATION, selectedValue);

   const businesses = await findBusinesses(selectedBusinessType, selectedRadius);

   for (let i = 0; i < MAX_RESULTS; i++) {
      const foundBusiness = businesses[i];
      const foundBusinessName = foundBusiness.name;
      const foundBusinessLatLong = geocodeToLatLong(foundBusiness.geocodes.main);

      theMap.addDeleteableMarkerWithPopup(foundBusinessLatLong, foundBusinessName);
   }

   console.log(theMap.hasMarkers());
   if (theMap.hasMarkers()) {
      controls.clearButtonShow();
   }
}

const findBusinesses = async (businessType, radius) => {
   const options = {
      method: 'GET',
      headers: {
         Accept: 'application/json',
         Authorization: FOURSQUARE_API_KEY
      }
   };
   const response = await fetch(`https://api.foursquare.com/v3/places/search?query=${businessType}&ll=34.050928644814434,-118.24881163103493&radius=${radius}`, options);
   const responseJson = await response.json();

   return responseJson.results;
}

const geocodeToLatLong = (geocode) => {
   return [geocode.latitude, geocode.longitude]
}

const clearSearch = async () => {
   theMap.removeMarkers();
   controls.clearButtonHide();
   controls.businessDropDown.selectedIndex = 0
}
