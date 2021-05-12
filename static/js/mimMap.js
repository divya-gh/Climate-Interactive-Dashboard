function buildMiniMap(country) {
var myMap = L.map("country")
.setView([0,0], 3);

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

var countriesGeo = 'https://opendata.arcgis.com/datasets/2b93b06dc0dc4e809d3c8db5cb96ba69_0.geojson'

var climateUrl = `/launch_data/${country}`;



// Grabbing our GeoJSON data..
d3.json(countriesGeo).then(function(geoData) {
        // countryLayer.addData(geoData, {filter: countryFilter});
        var countryLayer = L.geoJson(geoData, 
                {filter: countryFilter}, {style: {
                color: "orange",
                fillColor: "gray",
                fillOpacity: 0.6,
                weight: 3
                },
        }).addTo(myMap);

        function countryFilter(feature) {
                if (feature.properties.COUNTRY === country) return true
              };

        myMap.flyToBounds(countryLayer.getBounds())
});

// countryLayer.addTo(myMap);

d3.json(climateUrl).then(function(climateData) {

        var countryInfo = climateData.filter(obj => country === obj.Country);
        // console.log(countryInfo[0]);

        if (countryInfo[0]) {

                // console.log(countryInfo[0]['Avg Temp Change']);

                var avg_temp = countryInfo[0]['Avg Temp Change'];
                var avg_co2 = countryInfo[0]['Avg Co2 Change'];
                var population = countryInfo[0].Population;
                var flagLink = countryInfo[0].Images;
                var newCenter = [countryInfo[0].Lat, countryInfo[0].Lng];
                
        }
        else {

                var avg_temp = 0;
                var avg_co2 = 0;
                var population = 0;
                var flagLink = '';
                var newCenter = [0,0];
        };

        
        var stats = L.control({position: "bottomright"});
        stats.onAdd = function() {
                var div = L.DomUtil.create("div", "stats");
        
                var popup = "<b>Avg Temp Change: </b>" + avg_temp + "<br><b>Avg CO2 Emission: </b>" + avg_co2;
        
                div.innerHTML = popup;
        
                return div;
        };
        // Adding flag to the map
        stats.addTo(myMap);

        // return {popup: popup,
        //         newcenter: newCenter};
        if (flagLink) {
                var flag = L.control({ position: "bottomright" });
                flag.onAdd = function() {
                        var div = L.DomUtil.create("div", "flag");

                        
                        var flagImg = "<img src=" + flagLink + " alt= 'flag of " + country + "' width='75' height='50'>";
        
                        div.innerHTML = flagImg;
                
                        return div;        
                        
                };
        }
        // Adding flag to the map
        flag.addTo(myMap);

        // myMap.flyTo(newCenter);
        
});



};