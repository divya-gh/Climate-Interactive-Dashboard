var myMap = L.map("leaf")
            .setView([0,0], 10);

countriesGeo = 'static/data/countries.geojson'

streetLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
    }).addTo(myMap);

satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
    }).addTo(myMap);

var baseMaps = {
    Streets: streetLayer,
    Satellite: satelliteLayer
}

// Grabbing our GeoJSON data..
d3.json(countriesGeo).then(function(data) {
    // Creating a geoJSON layer with the retrieved data
    geoJson = L.geoJson(data, {
    // Style each feature (in this case a neighborhood)
    style: function(feature) {
        return {
        color: "white",
        // Call the chooseColor function to decide which color to color our neighborhood (color based on borough)
        // fillColor: chooseColor(feature.properties.ADMIN),
        fillColor: "gray",
        fillOpacity: 0.5,
        weight: 1.5
        };
    },
    // Called on each feature
    onEachFeature: function(feature, layer) {
        // Set mouse events to change map styling
        layer.on({
        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
        mouseover: function(event) {
            layer = event.target;
            layer.setStyle({
            fillOpacity: 0.9
            });
        },
        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
        mouseout: function(event) {
            layer = event.target;
            layer.setStyle({
            fillOpacity: 0.5
            });
        },
        // When a feature (neighborhood) is clicked, it changes the page and shows feature in a small card
        //   click: function(event) {
        //     myMap.fitBounds(event.target.getBounds());
        //   }
        });
        // Giving each feature a pop-up with information pertinent to it
        // layer.bindPopup("<h1>" + feature.properties.ADMIN + "</h1> <hr> <tr>" + feature.properties.borough + "</h2>");

    }
    }).addTo(myMap);
});

// var overlays = {
//     Countries: geoJson
// };

// function chooseColor(geoCountryName) {
//     climateInfo = getPopUp(geoCountryName);

//     if (climateInfo.averageTemp < 0) {
//         color = "red";
//     }
//     if (climateInfo.averageTemp > 0) {
//         color = "blue";
//     }
//     else {
//         color = "gray";
//     }
//     return color
// };

// function getPopUp(geoCountryName) {

//     // Use the list of sample names to populate the select options
//     d3.json("/launch_data").then((climateData) => {
//         climateData.forEach((country) => {
//             var countryName = country.Country;
//             var climateInfo;

//             if (countryName === geoCountryName) {
//                 climateInfo = {
//                     averageTemp: climateData['Avg Temp Change'],
//                     averageCO2: climateData['Avg Co2 Change'],
//                     population: climateData['Population']
//                 };       
//             }
//             else {
//                 climateInfo = {
//                     averageTemp: null,
//                     averageCO2: null,
//                     population: null
//                 };
//             };
//         });
//     });

//     return climateInfo;
// };

// function init() {

//     L.control.layers(baseMaps, {
//         collapsed: false
//     }).addTo(myMap);

// };
  

  
//   // Initialize the dashboard
//   init();


////use divid country for new smaller zoomed in map