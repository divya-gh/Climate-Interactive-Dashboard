var myMap = L.map("leaf")
            .setView([-0.17578097424708533,15.732421875000002], 3);

streetLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        // minZoom: 5,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
}).addTo(myMap);

satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        // minZoom: ,
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
var countriesGeo = 'https://opendata.arcgis.com/datasets/2b93b06dc0dc4e809d3c8db5cb96ba69_0.geojson'

var climateUrl = `/launch_data`;

// Grabbing our GeoJSON data..
d3.json(countriesGeo).then(function(geoData) {

        d3.json(climateUrl).then(function(climateData) {

                // Creating a GeoJSON layer with the retrieved data
                geoJsonLayer = L.geoJson(geoData, {
                        // // Style each feature based on avg temp change
                        style: {
                        color: "darkgray",
                        // fillColor: chooseColor(avg_temp),
                        fillOpacity: 0.6,
                        weight: 1
                        },
                        // Called on each feature
                        onEachFeature: function(feature, layer) {
                                var country = feature.properties.COUNTRY;

                                var countryInfo = climateData.filter(obj => country === obj.Country);
                                console.log(countryInfo);
        
                                if (typeof countryInfo !== 'undefined') {
                                        feature.properties[avg_temp] = countryInfo['Avg Temp Change'];
                                        feature.properties[avg_co2] = countryInfo['Avg Co2 Change'];
                                        feature.properties[population] = countryInfo.Population;
                                }
                                else {
                                        feature.properties[avg_temp] = '';
                                        feature.properties[avg_co2] = '';
                                        feature.properties[population] = '';
                                };
                             
                                
                                var avg_temp = feature.properties.avg_temp;
                                var avg_co2 = feature.properties.avg_co2;
                                var population = feature.properties.Population;
        
                                var popup = "<b>Country: </b>" + country + "<br><b>Avg Temp Change: </b>" + avg_temp + "<br><b>Avg CO2 Change: </b>" + avg_co2 + "<br><b>Population: </b>" + population;
                                
                                // Set mouse events to change map styling
                                layer.on({
                                        load: function(event) {
                                                layer = event.target;
                                                layer.setStyle({
                                                        fillColor: chooseColor(avg_temp)
                                                });
                                        },
                                        // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                                        mouseover: function(event) {
                                                layer = event.target;
                                                layer.setStyle({
                                                        fillOpacity: 0.9,
                                                        weight: 5
                                        });
                                        },
                                        // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                                        mouseout: function(event) {
                                                layer = event.target;
                                                layer.setStyle({
                                                        fillOpacity: 0.6,
                                                        weight: 1
                                        });
                                        },
                                        // When a feature (country) is clicked, it is enlarged to fit the screen
                                        click: function(event) {
                                                // console.log(event.latlng);
                                                // // myMap.fitBounds(event.target.getBounds());
                                                // myMap.setView(event.latlng,10)
                                                
                                        }
                                });
                                
                                //   // Giving each feature a pop-up with information pertinent to it
                                layer.bindPopup(popup);
                        }
                        }).addTo(myMap);

        });

  
});
