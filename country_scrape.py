# ----------IMPORTS----------
import requests
from bs4 import BeautifulSoup
import os
import pandas as pd
from splinter import Browser
from webdriver_manager.chrome import ChromeDriverManager

#Set up Splinter
executable_path = {'executable_path': ChromeDriverManager().install()}
browser = Browser('chrome', **executable_path, headless=False)

#---------OPEN BROWSER AND NAVIGATE TO WEBSITE------------
# FOR COUNTRY FLAGS
images_url = "https://www.worldometers.info/geography/flags-of-the-world/"
browser.visit(images_url) 
myhtml = browser.html  
soup = BeautifulSoup(myhtml, 'html.parser')

#--------CREATE NEW LIST----------
country_flags = []

#--------USING BEAUTIFUL SOUP TO GET INTO HTML------------
divs = soup.find_all('div', class_="col-md-4")

#--------LOOPING THROUGH THE DIVS TO PULL IMAGE HREF AND COUNTRY NAME----
for div in divs:
    image_url = f'https://www.worldometers.info{div.a["href"]}'
    country_name = div.text
    #--------APPENDING INFO TO LIST------------------
    country_flags.append({'name': country_name, 'image_url': image_url})

#--------PUT LIST INTO DATAFRAME TO USE LATER----------------
flag_df = pd.DataFrame(country_flags)

#--------UPDATE COUNTRY NAMES TO MATCH DEMO DATAFRAMES-------
flag_df['name'] = flag_df['name'].replace(['U.A.E.','U.S.', 'U.K.', 'DRC', 'CAR', 'Czechia', 'St. Vincent Grenadines'],['United Arab Emirates','United States','United Kingdom', 'DR Congo', 'Central Aftican Republic', 'Czech Republic (Czechia)', 'St. Vincent & Grenadines'])

#----WEBSCRAPE DIFF WEBSITE FOR DEMO--------
#OPEN BROWSER AND NAVIGATE TO WEBSITE FOR DEMO-----
demo_url = "https://www.worldometers.info/world-population/population-by-country/"
browser.visit(demo_url) 
myhtml = browser.html  
soup = BeautifulSoup(myhtml, 'html.parser')

#---------CREATE NEW LIST-----------
country_demo = []

#---------USING BEAUTIFUL SOUP TO GET INTO HTML-------
#-----ONLY PULLING IN HALF OF THE TABLE ROWS DUE TO DIFF CLASS NAMES------
table = soup.find_all('tbody')
table_rows = soup.find_all('tr', class_='odd')

#----------LOOPING THROUGH THE TABLE ROWS TO GET TABLE DETAILS------
for row in table_rows:
    country = row.find('a').text
    table_data = row.find_all('td')
    population = table_data[2].text
    density = table_data[5].text
    land_size = table_data[6].text
    med_age = table_data[9].text
    urban_pop = table_data[10].text
    #------ADDING INFO TO LIST-----------
    country_demo.append({'name': country, 'population': population, 'density': density, 'land-size': land_size, 'median_age': med_age, 'urban_pop': urban_pop})

#---------USING BEAUTIFUL SOUP TO GET INTO HTML-------
#-----PULLING IN SECOND HALF OF THE TABLE ROWS DUE TO DIFF CLASS NAMES------
table_rows = soup.find_all('tr', class_='even')

#----------LOOPING THROUGH THE TABLE ROWS TO GET TABLE DETAILS------
for row in table_rows:
    country = row.find('a').text
    table_data = row.find_all('td')
    population = table_data[2].text
    density = table_data[5].text
    land_size = table_data[6].text
    med_age = table_data[9].text
    urban_pop = table_data[10].text
    #------ADDING INFO TO LIST-----------
    country_demo.append({'name': country, 'population': population, 'density': density, 'land-size': land_size, 'median_age': med_age, 'urban_pop': urban_pop})

#--------PUT LIST INTO DATAFRAME-------------
demo_df = pd.DataFrame(country_demo)

#---------MERGE BOTH DATAFRAMES--------------
country_demo_df = pd.merge(demo_df, flag_df, on='name', how='left')

#---------SCRAPE FOR LATITUDE AND LONGITUDE----------
#--OPEN BROWSER AND  NAVIAGATE TO PAGE---------------
coord_url = "https://developers.google.com/public-data/docs/canonical/countries_csv"
browser.visit(coord_url) 
myhtml = browser.html  
soup = BeautifulSoup(myhtml, 'html.parser')

#--------CREATE NEW LIST FOR LAT/LONG-----------------------
country_coord = []

#---------USING BEAUTIFUL SOUP TO GET INTO HTML-------------------
table_rows = table.find_all('tr')

#---------LOOPING THROUGH ROWS---------------------------------
for row in table_rows[1:]:
    table_data = row.find_all('td')
    country = table_data[3].text
    lat = table_data[1].text
    long = table_data[2].text
    # APPEND TO COORDINATE LIST
    country_coord.append({'name': country, 'latitude': lat, 'longitude':long})

#------------PUT LIST INTO DATAFRAME--------------------------------
country_coord_df = pd.DataFrame(country_coord)

#------------MERGE WITH MERGED DATAFRAME---------------------------
country_df = pd.merge(country_demo_df, country_coord_df, on='name', how='left')

#---------PUSH MERGED DATAFRAME TO SQLITE DATABASE TO USE LATER----------
from sqlalchemy import create_engine
engine = create_engine('sqlite:///static/data/climateDB.db', echo=True)
sqlite_connection = engine.connect()

sqlite_table = 'country_demo'
country_df.to_sql(sqlite_table, sqlite_connection, if_exists='replace')

sqlite_connection.close()