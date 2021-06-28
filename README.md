
![thermometer pic](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/corters22/Images/thermometer%20pic.png)

This is a question that has been on everyone's mind since June 23, 1988 when Dr James Hansen, director of NASA's Institute for Space Studies testified before the US Senate[(1)]. Since that time, climate change has moved more and more from a scientific debate to a political one. There have been numerous studies done to see if CO2 emissions are being reduced, the changes of the Earth's temperature, and its affects on our future. 

As a project, we have decided to look into the temperature changes of the different countries of the world, spanning a time period of over 60 years, and created a dashboard depicting those changes. This dashboard contains current demographics of each country and has multiple charts that interact with each other to visually display how the temperatures have changed.

<h2 align='center'>Data</h2>

|         Format      |        Description       |
| ------------------------------ | ------------- |
| <img src="./static/Image/csv.png" alt="TP" align='left'  width="150" height="100">         |  **1. Temperature changes:** Data set found [here](https://www.kaggle.com/sevgisarac/temperature-change?select=Environment_Temperature_change_E_All_Data_NOFLAG.csv) shows the changes in temperature in each country from 1961 to 2019. The data is also split up into each month, so that you can compare January vs January, and by season. The changes go anywhere from 9&deg;C cooler to 11&deg;C warmer.<br/><br/> **2. CO2 Emissions:** Temperature fluctuations can be caused by many different events, one of which is CO2 emissions. Each country produces different amounts of CO2 dependent on their access to electricity, the total population, the urban population and other factors. We used the data from https://ourworldindata.org/co2-and-other-greenhouse-gas-emissions and you can find the dataset [here](./static/data/CO2_emission.csv). |
|         <img src="./static/Image/webScrape1.png" alt="TP" align='left'  width="150" height="100">                        |   **3. Country demographics:** Since the CO2 emissions can be influenced by the demographics of the country, the dashboard includes current demographics, as of May 2021, so that as you are reviewing the charts, you can see how the demographics might play a role. The demographics were scraped from three different websites using Beautiful Soup. After scraping the websites, the data was pushed into the sqlite database as an additional table and also saved as a csv file.<br><br>- a. __Flags__ - https://www.worldometers.info/geography/flags-of-the-world/<br>- b. __Population__ - https://www.worldometers.info/world-population/population-by-country/<br>-  c. __Latitude and Longitude coordinates__ - https://developers.google.com/public-data/docs/canonical/countries_csv<br><br>-  *You can find the scrape code [here](./country_scrape.py).*  |
|         <img src="./static/Image/Geojson.jpg" alt="TP" align='left'  width="150" height="100">                        |   **4. GeoJson:** For the map, we used Leaflet and geoJson files for the boundaries of each country. You can find the full geoJson file here https://opendata.arcgis.com/datasets/2b93b06dc0dc4e809d3c8db5cb96ba69_0.geojson.  |

<h2 align='center'>ETL</h2>

<img src="./static/Image/postgresql-logo.png" alt="TP" align='left'  width="120" height="100"> <br/>
- Data is queried, cleaned, transformed and loaded to *PostGresDB* using `python pandas`, `SQLAlchemy` . <br/>
- Find Postgres `Schema` [here](./static/data/climateDB.db.sql).
----
<h2 align='center'>Web Framework</h2>
<img src="./static/Image/flask_api.jpg" alt="TP" align='left'  width="120" height="100"> <br/>
- python Flask REST API is implemented to manage HTTP requests, render templates and JSON serialized data for manipulating the charts. <br/>
- Find FlaskAPI code [here](./app.py).

<h2 align='center'>Navigation</h2>

Data rendered from python Flask API is then used to visualize data on the web client. User can find the following features:

- __Launch Page :__  
    - Dropdown option to choose a country, a table of demographics (default World Info), and a geoJson map of the world. 
    - Built with HTML, Bootstrap , Jquery.js, JavaScript, Leaflet.js
               
- __Country Selection:__  
    - Select a country from the drop-down menu or click on the leaflet.js map.
    - Jquery.js is used to asynchronously render HTML elements for charts when a country is selected.
 
- __Demographic Table :__ 
    - When a country on the map is clicked or selected from the dropdown menu, the demographic table will also update with country-specific information.

- __Charts:__  Built with leaflet.js, Plotly.js and D3.js<br/>
Once a country is chosen from the dropdown or map, it will render new charts that display information specific to that country. 

   - __Warming Stripes chart:__ Built with Plotly.js,
        - Is a special kind of chart that is used as a country header that shows the increase and decrease of the temperatures by color. 
          Shades of red for warmer and shades of blue for colder. This chart is not interactive, but it sure does look cool.
   - __Country Map:__ Built with Leaflet.js,
        - Shows the map of the selected country and its overall temperature change and Co2 emission over time.
        - Country flag has been used as a legend.
   - __Line Chart:__ Built with D3.js,        
        - Shows all the temperature changes for each month of the year for the chosen country.
        - By clicking on Seasons or Months, you can see all the data for or navigate to a specific season/month over time since 1960. 
        - Hovering over the markers will show the value of the temperature change.
   - __Pie Chart:__ Built with D3.js,
        - Provides overall temperature change from 1960 to 2019. The Pie chart is also interactive with the line chart. Clicking on a particular season or 
          a month on the pie chart, provides access to the data and trends on the line chart.
   - __Temp and Co2 correlation chart:__ Built with D3.js,
        - Identifies the relation between countries Co2 production and avg. temp changes over the years. data is color-coded as green being low emission,
          yellow and orange being intermediate, and red being high.
        
*Note: All the charts are individually color-coded by seasons, months, and Co2 emission rate.*

- __Nagivation button:__ User can navigate back to the launch page via the navigation button on the top right or selecting *World Info* on the drop-down menu.

<h2 align='center'>Deployment</h2>
<img src="./static/Image/deploy-to-heroku.png" alt="TP" align='left'  width="120" height="100"> <br/>
- app
  
  
<h3 align='center'>ScreenShots</h3>

1. Launch Page Navigation: World Map and Demographic Information Table

![launch Page](./static/Image/navigate.gif)

2. Charts

![Charts](./static/Image/charts.gif)



<h2 align='center'>Tools and Technology</h2>

1. JavaScript
 
    + Plotly
    + D3.js
    + JQuery
    + Leaflet/GeoJson
    + SVG

2. Python

    + Flask
    + SqlAlchemy
    + Pandas
    + Beautiful Soup
    + Splinter

3. Sqlite
4. CSS
5. Bootstrap
6. HTML


<h3 align='center'>Source Code</h3>

1. [Climate.py](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/climate.py)
    -contains functions to pull necessary data from database
2. [app.py](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/app.py)
    -contains flask application with routes to render HTML page
    -needs to be run to launch page on local host
3. [country_scrape.py](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/country_scrape.py)
    -contains python script to scrape websites for country demographics
4. [JQueryRenderHTML.js](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/static/js/JQueryRenderHTML.js)
    -contains JQuery functions to render HTML page events
5. [map.js](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/static/js/map.js) and [mimMap.js](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/static/js/mimMap.js)
    -contains geoJson for main map of countries with events and map of selected country with(out) flag
6. [launch.js](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/static/js/launch.js)
    -contains function to render initial launch page
7. [pieLineChart.js](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/static/js/pieLineChart.js)
    -contains SVG for pie chart and the line chart
8. [scatterTempCO2.js](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/static/js/scatterTempCO2.js)
    -contains SVG for scatter chart
9. [stripe_chart.js](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/static/js/stripe_chart.js)
    -contians function for plotly to create warming stripes chart.





