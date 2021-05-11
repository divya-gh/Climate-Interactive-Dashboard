# Final changes to files: 

## New File

[mimMap.js](static/js/mimMap.js)

## Replace File

[map.js](static/js/map.js)

## index.html

1. add background image for map
2. update leaflet CSS and JS
3. add new file

```
<img class="w-50 map-background" src="http://2.bp.blogspot.com/-8P_iI3YueO0/T73feHn5VSI/AAAAAAAAAiw/N5N3HmVmk9I/s1600/6a00d834516a0869e2016760f339c3970b-800wi.jpg" alt="Big Smileys" />

    <!-- Leaflet CSS -->
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" />

     <!-- Leaflet JS -->
   <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>

   <!-- minimap js -->
    <script src="/static/js/mimMap.js"></script>
```

## style.css

1. add to media query

```
      #country {
        height: 100vh;
        width: 100vw;
        position: relative;
      }
```

2. add all below:

```
#map {
  /* height: 850px; */
  width: 100%;
  position: relative;
}

.map-background {
    opacity: 0.0;
}

.stats {
    padding: 10px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    /* font-weight: bold; */
    line-height: 18px;
    color: #555;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }

  .legend {
    padding: 10px;
    font-family: 'Segoe UI', sans-serif;
    font-size: 14px;
    /* font-weight: bold; */
    line-height: 18px;
    color: #555;
    background-color: white;
    border-radius: 5px;
    box-shadow: 0 0 15px rgba(0, 0, 0, 0.2);
  }
```

## JQueryRenderHTML.js

1. add image background for mini map to addDom

2. add buildMiniMap function to plotCharts

```
   //add background for country so map will display
    $("#country").append('<img class="w-50 map-background" src="http://2.bp.blogspot.com/-8P_iI3YueO0/T73feHn5VSI/AAAAAAAAAiw/N5N3HmVmk9I/s1600/6a00d834516a0869e2016760f339c3970b-800wi.jpg" alt="Big Smileys" />')


    //build MiniMap
    buildMiniMap(country);
```


