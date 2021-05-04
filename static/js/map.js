var myMap = L.map("map")
            .setView([0,0], 10);

countriesGeo = 'static\data\countries.geojson'

function buildWorldMap(overlays) {

    streetLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/streets-v11",
        accessToken: API_KEY
        });

    satelliteLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
        tileSize: 512,
        maxZoom: 18,
        zoomOffset: -1,
        id: "mapbox/satellite-streets-v11",
        accessToken: API_KEY
        });

    geojson = L.choropleth(data, {

        // Define what  property in the features to use
        valueProperty: "MHI2016",
    
        // Set color scale
        scale: ["#ffffb2", "#b10026"],
    
        // Number of breaks in step range
        steps: 10,
    
        // q for quartile, e for equidistant, k for k-means
        mode: "q",
        style: {
            // Border color
            color: "#fff",
            weight: 1,
            fillOpacity: 0.8
        },
    
        // Binding a pop-up to each layer
        onEachFeature: function(feature, layer) {
            layer.bindPopup("Zip Code: " + feature.properties.ZIP + "<br>Median Household Income:<br>" +
            "$" + feature.properties.MHI2016);
        }
        }).addTo(myMap);


};


function init() {
    // Grab a reference to the map element
    var selector = d3.select("#map");

    var countryPolys = [];
  
    // Use the list of sample names to populate the select options
    d3.json("/map_data").then((climateData) => {
        d3.json(countriesGeo).then((geoData) => {
            climateData.forEach((country) => {
                var countryName = country.country_name;
                var geoCountryName = geoData.features.properties.admin;
                var climateInfo;

                if (countryName === geoCountryName) {
                    climateInfo = {
                        averageTemp: climateData.tool_tip.avg_temp,
                        averageCO2: climateData.tool_tip.avg_co2};
                        // uncomment when scraped data is added
                        // population: climateData.tool_tip.population
                    // };       
                }
                else {
                    climateInfo = {
                        averageTemp: null,
                        averageCO2: null};
                        // uncomment when scraped data is added
                        // population: null
                    // };
                };

                var countryPoly = {
                    countryName: geoCountryName,
                    climateInfo: climateInfo,
                    geometry: geoData.features.geometry 
                };

                countryPolys.push(countryPoly);
            });
            console.log(countryPolys);
        });
    });
  };
  
  // edit function here to change the map when a country is selected.
//   function optionChanged(newSample) {
//     // Fetch new data each time a new sample is selected
//     console.log(`change ${{newSample}}`)
//     buildCharts(newSample);
  
//   }
  
  // Initialize the dashboard
  init();