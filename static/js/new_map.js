var myMap = L.map("leaf")
            .setView([0,0], 3);


var countriesGeo = 'https://opendata.arcgis.com/datasets/2b93b06dc0dc4e809d3c8db5cb96ba69_0.geojson'

// Grabbing our GeoJSON data..
d3.json(countriesGeo).then(function(data) {
    // Creating a GeoJSON layer with the retrieved data
    L.geoJson(data, {
        // // Style each feature based on avg temp change
        style: function(feature) {
            return {
            color: "darkgray",
            fillColor: chooseColor(feature.properties.COUNTRY),
            // fillColor: "gray",
            fillOpacity: 0.6,
            weight: 1
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
                fillOpacity: 0.6
              });
            },
            // When a feature (country) is clicked, it is enlarged to fit the screen
            click: function(event) {
              myMap.fitBounds(event.target.getBounds());
            }
          });
          // Giving each feature a pop-up with information pertinent to it
          layer.bindPopup(getPopUp(feature.properties.COUNTRY));
        }
        }).addTo(myMap);
  });

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
    });

var baseMaps = {
    Streets: streetLayer,
    Satellite: satelliteLayer
};

function chooseColor(country) {
    url = `/launch_data` ;
    console.log(country)

    d3.json(url).then(function(data) {
        for (i=0; i< data.length; i++) {
            if (data[i].Country == country) {
                avg_temp = data[i]['Avg Temp Change']
                if (avg_temp > 0) {
                    var color = "red";
                }
                else if (avg_temp < 0) {
                    var color = "blue";
                }
                else {
                    var color = "gray";
                };
            }
            else {
                var color = "none";
                console.log('Country Not Found');
            };

        };
        return color;
    });    

};

function getPopUp(country) {
    url = `/launch_data`;
    console.log(country);

    d3.json(url).then(function(data) {
        for (i=0; i< data.length; i++) {
            if (data[i].Country == country) {
                var popup = "<b>Country: </b>" + data[i]['Country'] + "<br><b>Avg Temp Change: </b>" + data[i]['Avg Temp Change'] + "<br><b>Avg CO2 Change: </b>" + data[i]['Avg Co2 Change'] + "<br><b>Population: </b>" + data[i]['Population'];         
            }
            else {
                var popup = "<b>Country: </b>" + country 
                console.log('Country Not Found');
            };

        };
        return popup;
    });    

};




// Country GeoJson Styled based on API data
// var countries = L.geoJson(countriesGeo).addTo(myMap);
// L.geoJSON(JSON.parse(countriesGeo)).addTo(myMap);
    
    // , {
    // // Style each feature based on avg temp change
    // style: function(feature) {
    //     return {
    //     color: "white",
    //     // fillColor: chooseColor(feature),
    //     fillColor: "gray",
    //     fillOpacity: 0.5,
    //     weight: 1.5
    //     };
    // }})
    // // .bindPopup("<b>Location: </b>" + location + "<br><b>Magnitude: </b>" + magnitude + "<br><b>Depth: </b>" + depth + "<br><b>Lat,Long: </b>(" + lat +","+ long +")")
    // .addTo(myMap);



// var overlays = {
//     Countries: geoJson
// };



function init() {

    L.control.layers(baseMaps, {
        collapsed: false
    }).addTo(myMap);

};
  

  
  // Initialize the dashboard
  init();


////use divid country for new smaller zoomed in map