  
var myMap = L.map("leaf")
.setView([-0.17578097424708533,15.732421875000002], 3);


satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
tileSize: 512,
maxZoom: 18,
zoomOffset: -1,
id: "mapbox/satellite-streets-v11",
accessToken: API_KEY
}).addTo(myMap);

// var baseMaps = {
// Streets: streetLayer,
// Satellite: satelliteLayer
// };

function chooseColor(avg_temp) {
    if (avg_temp > 120.958) {
            var color = "red";
    }
    else if (avg_temp > 80.958) {
            var color = "lightcoral";
    }
    else if (avg_temp > 40.958) {
            var color = "royalblue";
    }
    else if (avg_temp > 0) {
            var color = "darkblue";
    }

    else {
            var color = "gray";
    };

    console.log(color);

    return color;  
};

var countriesGeo = 'https://opendata.arcgis.com/datasets/2b93b06dc0dc4e809d3c8db5cb96ba69_0.geojson'

var climateUrl = `/launch_data`;

// Grabbing our GeoJSON data..
d3.json(countriesGeo).then(function(geoData) {

d3.json(climateUrl).then(function(climateData) {

    // Creating a GeoJSON layer with the retrieved data
    countryLayer = L.geoJson(geoData, {
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
                    console.log(countryInfo[0]);
        
                    if (countryInfo[0]) {

                            console.log(countryInfo[0]['Avg Temp Change']);

                            var avg_temp = countryInfo[0]['Avg Temp Change'];
                            var avg_co2 = countryInfo[0]['Avg Co2 Change'];
                            var population = countryInfo[0].Population;
                            var flagLink = countryInfo[0].Images;
                            
                    }
                    else {

                            var avg_temp = 0;
                            var avg_co2 = 0;
                            var population = 0;
                            var flagLink = '';
                    };

                    feature.properties.avg_temp = avg_temp;
                    feature.properties.flag_Link = flagLink;
                    console.log(feature.properties.avg_temp);
            
                    
                    var popup = "<b>Country: </b>" + country + "<br><b>Avg Temp Change: </b>" + avg_temp + "<br><b>Avg CO2 Change: </b>" + avg_co2 + "<br><b>Population: </b>" + population;
                    
                    // Set mouse events to change map styling
                    layer.on({
                            // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                            mouseover: function(event) {
                                    layer = event.target;
                                    layer.setStyle({
                                            fillOpacity: 0.9,
                                            weight: 5
                                    });
                                    this.openPopup()
                            },
                            // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                            mouseout: function(event) {
                                    layer = event.target;
                                    layer.setStyle({
                                            fillOpacity: 0.5,
                                            weight: 1
                                    });
                                    this.closePopup()
                            },
                            // When a feature (country) is clicked, it is enlarged to fit the screen
                            click: function(event) {

                                    console.log(event.latlng);
                                    newView = event.latlng;
                                    
                                    layer = event.target;
                                    layer.setStyle({
                                        fillColor: "gray",
                                        color: "orange"

                                     });

                                     newBounds = layer.getBounds()

                                     myMap.setView(newView, 7)

                                     $('#leaf').addClass('col-6');

                                     myMap.fitBounds(newBounds);

                                    // Set up the legend
                                    var flag = L.control({ position: "bottomright" });
                                    flag.onAdd = function() {
                                            var div = L.DomUtil.create("div", "info legend");

                                            var flagImg = "<img src=" + flagLink + " alt= 'flag of " + country + "' width='75' height='50'>";

                                            div.innerHTML = flagImg;

                                            return div;
                                    };

                                    // Adding flag to the map
                                    flag.addTo(myMap);

                                    

                                    var clonedMap = $(".leafletmap").clone();

                                    countryDropdown = d3.select("#selDataset").node();
                                    countryDropdown.value = country;

                                    addDom(country);

                                    // addDom(country, newView, newBounds, countriesGeo);

                                    $("#second-chart").append(clonedMap.attr("id","country"));

                                //    miniMap(country, newView, newBounds, countriesGeo);
                                    
                            }
                    });
                    layer.setStyle({
                            fillColor: chooseColor(feature.properties.avg_temp)
                    });
                    //   // Giving each feature a pop-up with information pertinent to it
                    layer.bindPopup(popup);
            }
            }).addTo(myMap);
            // L.control.layers(baseMaps, countryLayer).addTo(myMap);
});


});

function miniMap(country, newView, newBounds, countriesGeo) {
    
    var miniMap = L.map("country").setView(newView);
    
    miniMap.fitBounds(newBounds);

    streetLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
        }).addTo(miniMap);

    var countryUrl = `/launch_data/${country}`;

    var miniSatMap = cloneLayer(satelliteLayer);
    miniSatMap.addTo(miniMap);

    // Grabbing our GeoJSON data..
    d3.json(countriesGeo).then(function(geoData) {

        d3.json(countryUrl).then(function(climateData) {
        
            // Creating a GeoJSON layer with the retrieved data
            indvCountry = L.geoJson(geoData, {
                    // // Style each feature based on avg temp change
                    style: {
                    color: "orange",
                    fillColor: "gray",
                    fillOpacity: 0.6,
                    weight: 5
                    },
                    // Called on each feature
                    onEachFeature: function(feature, layer) {
                            var country = feature.properties.COUNTRY;
        
                            var countryInfo = climateData.filter(obj => country === obj.Country);
                            console.log(countryInfo[0]);
                
                            if (countryInfo[0]) {
        
                                    console.log(countryInfo[0]['Avg Temp Change']);
        
                                    var avg_temp = countryInfo[0]['Avg Temp Change'];
                                    var avg_co2 = countryInfo[0]['Avg Co2 Change'];
                                    var population = countryInfo[0].Population;
                                    var flagLink = countryInfo[0].Images;
                                    
                            }
                            else {
        
                                    var avg_temp = 0;
                                    var avg_co2 = 0;
                                    var population = 0;
                                    var flagLink = '';
                            };
        
                            feature.properties.avg_temp = avg_temp;
                            feature.properties.flag_Link = flagLink;
                            console.log(feature.properties.avg_temp);
                    
                            
                            var popup = "<b>Country: </b>" + country + "<br><b>Avg Temp Change: </b>" + avg_temp + "<br><b>Avg CO2 Change: </b>" + avg_co2 + "<br><b>Population: </b>" + population;
                                                // Set mouse events to change map styling
                            layer.on({
                                onAdd: function() {
                                    var flag = L.control({ position: "bottomright" });
                                    flag.onAdd = function() {
                                            var div = L.DomUtil.create("div", "info legend");
                            
                                            var flagImg = "<img src=" + flagLink + " alt= 'flag of " + country + "' width='75' height='50'>";
                            
                                            div.innerHTML = flagImg;
                            
                                            return div;
                                    };
                            
                                    // Adding flag to the map
                                    flag.addTo(myMap);
                                },
                                // When a user's mouse touches a map feature, the mouseover event calls this function, that feature's opacity changes to 90% so that it stands out
                                mouseover: function(event) {
                                        layer = event.target;
                                        layer.setStyle({
                                                fillOpacity: 0.9,
                                                weight: 5
                                        });
                                        this.openPopup()
                                },
                                // When the cursor no longer hovers over a map feature - when the mouseout event occurs - the feature's opacity reverts back to 50%
                                mouseout: function(event) {
                                        layer = event.target;
                                        layer.setStyle({
                                                fillOpacity: 0.5,
                                                weight: 1
                                        });
                                        this.closePopup()
                                }
                            });
                
                //   // Giving each feature a pop-up with information pertinent to it
                layer.bindPopup(popup);
        }
        }).addTo(miniMap);


    });
});

};