// var myMap = L.map("map")
//             .setView([0,0], 10);

// countriesGeo = 'static/data/countries.geojson'

// function buildWorldMap(overlays) {

//     streetLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: "mapbox/streets-v11",
//         accessToken: API_KEY
//         });

//     satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
//         attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
//         tileSize: 512,
//         maxZoom: 18,
//         zoomOffset: -1,
//         id: "mapbox/satellite-streets-v11",
//         accessToken: API_KEY
//         });

//     geojson = L.choropleth(data, {

//         // Define what  property in the features to use
//         valueProperty: "MHI2016",
    
//         // Set color scale
//         scale: ["#ffffb2", "#b10026"],
    
//         // Number of breaks in step range
//         steps: 10,
    
//         // q for quartile, e for equidistant, k for k-means
//         mode: "q",
//         style: {
//             // Border color
//             color: "#fff",
//             weight: 1,
//             fillOpacity: 0.8
//         },
    
//         // Binding a pop-up to each layer
//         onEachFeature: function(feature, layer) {
//             layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
//             "$" + feature.properties.MHI2016);
//         }
//         }).addTo(myMap);


// };


// function init() {
//     // Grab a reference to the map element
//     var selector = d3.select("#map");

//     var countryPolys;
  
//     // Use the list of sample names to populate the select options
//     d3.json("/launch_data").then((climateData) => {
//         d3.json(countriesGeo).then((geoData) => {
//             // climateData.forEach((country) =>
//             for (var i = 0; i < climateData.length; i++) {
//                 var countryName = country.Country;

//                 geoData.forEach((poly) => {
//                     var geoCountryName = poly.properties.ADMIN;
//                     var climateInfo;
    
//                     if (countryName === geoCountryName) {
//                         climateInfo = {
//                             averageTemp: climateData['Avg Temp Change'],
//                             averageCO2: climateData['Avg Co2 Change'],
//                             population: climateData['Population']
//                         };       
//                     }
//                     else {
//                         climateInfo = {
//                             averageTemp: null,
//                             averageCO2: null,
//                             population: null
//                         };
//                     };
    
//                     var countryPoly = {
//                         countryName: geoCountryName,
//                         climateInfo: climateInfo,
//                         geometry: geoData.features.geometry 
//                     };
    
//                     countryPolys.push(countryPoly);
//                     // Create a new marker with the appropriate icon and coordinates
//                     var newMarker = L.marker([station.lat, station.lon], {
//                         icon: icons[stationStatusCode]
//                     });

//                     // Add the new marker to the appropriate layer
//                     newMarker.addTo(layers[stationStatusCode]);

//                 });

//                 // Grabbing our GeoJSON data..
// d3.json(link).then(function(data) {
//     // Creating a geoJSON layer with the retrieved data
//     L.geoJson(data, {
//       // Style each feature (in this case a neighborhood)
//       style: function(feature) {
//         return {
//           color: "white",
//           // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
//           fillColor: chooseColor(feature.properties.borough),
//           fillOpacity: 0.5,
//           weight: 1.5
//         };
//       },
//       // Called on each feature
//       onEachFeature: function(feature, layer) {
//         // Set mouse events to change map styling
//         layer.on({
//           // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
//           mouseover: function(event) {
//             layer = event.target;
//             layer.setStyle({
//               fillOpacity: 0.9
//             });
//           },
//           // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
//           mouseout: function(event) {
//             layer = event.target;
//             layer.setStyle({
//               fillOpacity: 0.5
//             });
//           },
//           // When a feature (neighborhood) is clicked, it is enlarged to fit the screen
//         //   click: function(event) {
//         //     myMap.fitBounds(event.target.getBounds());
//         //   }
//         });
//         // Giving each feature a pop-up with information pertinent to it
//         layer.bindPopup("<h1>" + feature.properties.neighborhood + "</h1> <hr> <h2>" + feature.properties.borough + "</h2>");
  
//       }
//     }).addTo(myMap);
//   });

//             });

//             console.log(countryPolys);
//         });
//     });
//   };
  
//   // edit function here to change the map when a country is selected.
// //   function optionChanged(newSample) {
// //     // Fetch new data each time a new sample is selected
// //     console.log(`change ${{newSample}}`)
// //     buildCharts(newSample);
  
// //   }
  
//   // Initialize the dashboard
//   init();