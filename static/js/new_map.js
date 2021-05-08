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
            fillColor: "gray",
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
        //   // Giving each feature a pop-up with information pertinent to it
        //   layer.bindPopup(getPopUp(feature.properties.COUNTRY));
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

function chooseColor(avg_temp) {
    if (avg_temp > 0) {
        var color = "red";
    }
    else if (avg_temp < 0) {
        var color = "blue";
    }
    else {
        var color = "gray";
    };


    return color;  

};

function calcSize(avg_co2, population) {
    size = avg_co2 * population;
    return size;
};

var climateMarkers = [];
url = `/launch_data`;

d3.json(url).then(function(data) {
    for (i=0; i< data.length; i++) {
        var feature = data[i];
        var name = feature.Country;
        var lat = +feature.lat;
        var long = +feature.lng;
        var avg_temp = feature['Avg Temp Change'];
        var avg_co2 = feature['Avg Co2 Change'];
        var population = feature.Population;
        var popup = "<b>Country: </b>" + name + "<br><b>Avg Temp Change: </b>" + avg_temp + "<br><b>Avg CO2 Change: </b>" + avg_co2 + "<br><b>Population: </b>" + population;
        console.log([lat, long])

        var marker = L.circle([lat, long], {
            stroke: true,
            weight: 0.5,
            color: 'white',
            fillColor: chooseColor(avg_temp),
            fillOpacity: 0.75,
            radius: calcSize(avg_co2, population), 

        }).bindPopup(popup);

        climateMarkers.push(marker);
       var climateLayer = L.layerGroup(quakeMarkers).addTo(myMap);

    };

}); 




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