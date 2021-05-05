![thermometer pic](https://github.com/divya-gh/Climate-Interactive-Dashboard/blob/corters22/Images/thermometer%20pic.png)

This is a question that has been on everyone's mind since June 23, 1988 when Dr James Hansen, director of NASA's Institute for Space Studies testified before the US Senate[(1)]. Since that time, climate change has moved more and more from a scientific debate to a political one. There have been numerous studies done to see if the CO2 emissions are being reduced, the changes of the Earth's temperature, and its affects on the future. 

As a project, we have decided to look into the temperature changes of the different countries of the world, spanning a time period of over 60 years, and created a dashboard depicting those changes. This dashboard contains current demographics of each country and has multiple charts that interact with each other to visually display how the temperatures have changed.

<h2 align='center'>Data</h2>

**1. Temperature changes**

The original dataset can be found [here](https://www.kaggle.com/sevgisarac/temperature-change?select=Environment_Temperature_change_E_All_Data_NOFLAG.csv) and shows the changes in temperature in each country from 1961 to 2019. The data is also split up into each month, so that you can compare January vs January, and by season. The changes go anywhere from 9&deg;C cooler to 11&deg;C warmer.

**2. CO2 Emissions**

Temperature fluctuations can be caused by many different events, one of which is CO2 emissions. Each country produces different amounts of CO2 dependent on their access to electricity, the total population, the urban population and other factors. We used the data from 

**3. Country demographics**

Since the CO2 emissions can be influenced by the demographics of the country, the dashboard includes current demographics, as of May 2021, so that as you are reviewing the charts, you can see how the demographics might play a role. The demographics were scraped from three different websites using Beautiful Soup. After scraping the websites, the data was pushed into the sqlite database as an additional table.

  a. Flags - https://www.worldometers.info/geography/flags-of-the-world/
  
  b. Population - https://www.worldometers.info/world-population/population-by-country/
  
  c. Latitude and Longitude coordinates - https://developers.google.com/public-data/docs/canonical/countries_csv
  
*You can find the scrape code [here](https://github.com/divya-gh/Climate-Interactive-Dashboard/edit/main/country-scrape.py).*

**4. Cleaning Data**

AFter pulling the data in from the csv files, the temperature change file was reduced to only include the temperature changes and not the standard deviations. The null values were also dropped. After cleaning the data, it was imported into the sqlite database found [here](https://github.com/divya-gh/Climate-Interactive-Dashboard/edit/main/static/data/climateDB.db).




[(1)]: https://theconversation.com/30-years-ago-global-warming-became-front-page-news-and-both-republicans-and-democrats-took-it-seriously-97658#:~:text=June%2023%2C%201988%20marked%20the,change%20became%20a%20national%20issue.
