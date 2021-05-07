var myMap = L.map("leaf")
            .setView([0,0], 3);

countriesGeo = 'static/data/countries.geojson'

// Another solution.... maybe
// countriesGeo = 'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'

// countries = d3.json(countriesGeo).then(data => data);

country = 'China'

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
};

function getAPIData() {
    url = `/launch_data` ;

    geoData = d3.json(url).then(data => data);

};

function chooseColor(country) {

    const allowed = [country];

    const filtered = Object.keys(geoData)
    .filter(key => allowed.includes(key))
    .reduce((obj, key) => {
        obj[key] = raw[key];
        return obj;
    }, {});

    console.log(filtered);




    return color
};

function getPopUp(country) {

};


// Country GeoJson Styled based on API data
geoJson = L.geoJson(countriesGeo, {
    // Style each feature based on avg temp change
    style: function(feature) {
        return {
        color: "white",
        // fillColor: chooseColor(feature),
        fillColor: "gray",
        fillOpacity: 0.5,
        weight: 1.5
        };
    }})
    // .bindPopup("<b>Location: </b>" + location + "<br><b>Magnitude: </b>" + magnitude + "<br><b>Depth: </b>" + depth + "<br><b>Lat,Long: </b>(" + lat +","+ long +")")
    .addTo(myMap);



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