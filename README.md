![thermometer pic](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/corters22/Images/thermometer%20pic.png)

This is a question that has been on everyone's mind since June 23, 1988 when Dr James Hansen, director of NASA's Institute for Space Studies testified before the US Senate[(1)]. Since that time, climate change has moved more and more from a scientific debate to a political one. There have been numerous studies done to see if CO2 emissions are being reduced, the changes of the Earth's temperature, and its affects on our future. 

As a project, we have decided to look into the temperature changes of the different countries of the world, spanning a time period of over 60 years, and created a dashboard depicting those changes. This dashboard contains current demographics of each country and has multiple charts that interact with each other to visually display how the temperatures have changed.

<h2 align='center'>Data</h2>

**1. Temperature changes**

The original dataset can be found [here](https://www.kaggle.com/sevgisarac/temperature-change?select=Environment_Temperature_change_E_All_Data_NOFLAG.csv) and shows the changes in temperature in each country from 1961 to 2019. The data is also split up into each month, so that you can compare January vs January, and by season. The changes go anywhere from 9&deg;C cooler to 11&deg;C warmer. Data was manually entered into sqlite database.

**2. CO2 Emissions**

Temperature fluctuations can be caused by many different events, one of which is CO2 emissions. Each country produces different amounts of CO2 dependent on their access to electricity, the total population, the urban population and other factors. We used the data from https://ourworldindata.org/co2-and-other-greenhouse-gas-emissions and you can find the dataset [here](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/main/static/data/annual-co-emissions-by-region.csv). Data was manually entered into sqlite database.

**3. Country demographics**

Since the CO2 emissions can be influenced by the demographics of the country, the dashboard includes current demographics, as of May 2021, so that as you are reviewing the charts, you can see how the demographics might play a role. The demographics were scraped from three different websites using Beautiful Soup. After scraping the websites, the data was pushed into the sqlite database as an additional table.

  a. Flags - https://www.worldometers.info/geography/flags-of-the-world/
  
  b. Population - https://www.worldometers.info/world-population/population-by-country/
  
  c. Latitude and Longitude coordinates - https://developers.google.com/public-data/docs/canonical/countries_csv
  
*You can find the scrape code [here](https://github.com/divya-gh/Climate-Interactive-Dashboard/edit/main/country-scrape.py).*

**4. GeoJson**

For the map, we used Leaflet and geoJson files for the boundaries of the each country. You can find the full geoJson file here https://opendata.arcgis.com/datasets/2b93b06dc0dc4e809d3c8db5cb96ba69_0.geojson. 

**5. Cleaning Data**

After pulling the data in from the csv files, the temperature change file was reduced to only include the temperature changes and not the standard deviations. The null values were also dropped. Any years prior to 1961 were also dropped on the CO2 Emission data to match the temperature change data. After cleaning the data, it was imported into the sqlite database found [here](https://github.com/divya-gh/Climate-Interactive-Dashboard/edit/main/static/data/climateDB.db).

![world climate pic](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/corters22/Images/Climate%20zones2.png)

<h2 align='center'>Navigation</h2>

Using Flask, the initial html page shows a dropdown option to choose a country, a table of demographics (default United States) and a geoJson map of the world. Once a country is chosen from the dropdown, it will render new charts that display information specific to that country. The header bar is a special kind of chart that shows the increase and decrease of the temperatures by color. Shades of red for warmer and shades of blue for colder. This chart is not interactive, but it sure does look cool. The demographic table will also update. A country can also be chosen by clicking on the country on the map. While the mouse is hovering over the country, a toolTip shows the country name, the population and average temperature change. Since data is not available for all countries, your selection is limited to the highlighted countries on the map. The countries highlighted in red show an average increase in temperature whereas the countires highlighted in blue show a decrease in temperature. After choosing a country and the charts update, the dropdown box is still available to choose a new country or you can navigate back to the homepage by clicking on the world map button on the top.

<h3 align='center'>Charts</h3>

1. Picture of country with flag(if flag data was found)

2. Line Chart

    + Shows all the temperature changes for each month of the years for the chosen country.
    + By clicking on Seasons or Months, you can see all the data for or navigate to a specific season/month for that country. 
    + Hovering over the markers will show the value of the temperature change.

3. Pie Chart

    + With this chart, you can see the data specific to the seasons.

4. Scatter Plot

    + Shows a correlation of temperature change and year. The size and color of the markers coordinate with population and CO2 emissions. 


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

<h3 align='center'>ScreenShots</h3>

<h3 align='center'>Files</h3>

1. Climate.py
    -contains functions to pull necessary data from database
2. app.py
    -contains flask application with routes to render HTML page
    -needs to be run to launch page on local host
3. country_scrape.py
    -contains python script to scrape websites for country demographics
4. JQueryRenderHTML.js
    -contains JQuery functions to render HTML page events
5. map.js
    -contains geoJson for main map of countries with events and map of selected country with(out) flag
6. launch.js
    -contains function to render initial launch page
7. pie&line.js
    -contains SVG for pie chart and the line chart
8. scatterTempCO2.js
    -contains SVG for scatter chart
9. stripe_chart.js
    -contians function for plotly to create warming stripes chart.




[(1)]: https://theconversation.com/30-years-ago-global-warming-became-front-page-news-and-both-republicans-and-democrats-took-it-seriously-97658#:~:text=June%2023%2C%201988%20marked%20the,change%20became%20a%20national%20issue.
