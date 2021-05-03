# dependencies
import os
#clear Screen
os.system("cls")


import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, join, outerjoin, MetaData, Table

# create engine to hawaii.sqlite
connect_string = "sqlite:///static/data/climateDB.db"

# reflect the tables
engine = create_engine(connect_string) 

# reflect an existing database into a new model
Base = automap_base()

# reflect the tables
Base.prepare(engine, reflect =True)

# View all of the classes that automap found
print(Base.classes.keys())

# Save references to each table
Emission = Base.classes.CO2_emission
Temp_change = Base.classes.temp_change

#print(Emission)

# Create a session (link) from Python to the sqlite DB
session = Session(bind = engine)

#Filter the data for the year >= 1961
results_emission = session.query(Emission).filter(Emission.Year >= 1961)
#print(results) 


emission_df = pd.read_sql(results_emission.statement, session.connection())

print(emission_df.head())
results_temp = session.query(Temp_change)

#print(results) 

temp_df = pd.read_sql(results_temp.statement, session.connection())

selection = ['DecJanFeb', 'MarAprMay', 'JunJulAug', 'SepOctNov']

season_df = temp_df.loc[temp_df["Months"].isin(selection)]

#filter by months
month_df = temp_df.loc[(~temp_df["Months"].isin(selection)) & (temp_df["Months"] != 'Meteorological year') ]

# filter Meteorological year
meteor_df = temp_df.loc[temp_df["Months"] == 'Meteorological year' ]
# Calculate avg temp per Meteorological year
meteor_df['avg_temp']= meteor_df.mean(axis =1)
meteor_id_df = meteor_df.set_index('Area')

session.close() 

##===================================================================##
##Functions
##====================================================================##

## Return launchPage

def launchPage() :   

    # Average Temperature
    avg_temp = meteor_id_df['avg_temp']

    #calculate avg co2 emission per country
    avg_co2 =  emission_df.groupby("Entity").agg({'AnnualCO2emissions':'mean'})

    #Find countries by temp change
    country_name = temp_df['Area'].unique()

    # Merge Countries in temp_change to Co2 Emission
    country_name_df = pd.DataFrame(country_name)
    merged_co2_country =country_name_df.merge(avg_co2, how = 'outer', left_on=0, right_on='Entity', left_index=False, right_index=False,)
    #find null
    merged_co2_country.isna().sum()
    #fill 0
    merged_co2_country = merged_co2_country.fillna(0)
    #find null
    merged_co2_country.isna().sum()

    #New Avg Co2 Emission per country
    new_Avg_c02 = merged_co2_country['AnnualCO2emissions']
    new_Avg_c02 = round(new_Avg_c02/1000000,3) ## converting GT to Mega ton for the tooltip

    #Create a dictionary holding above values
     #meta ={
    #    'country' : country_name,
    #    'demo_info' : [web scraped data],
    #    'tool_tip' : [{'c_name': country_name,
    #                'avg_temp':avg_temp,
    #                'avg_co2' : new_Avg_c02,
    #                'population':population from web scraping
    #                }]
    #   }  
    meta ={
        'country' : country_name,
        'tool_tip' : [{'c_name': country_name,
                    'avg_temp':avg_temp,
                    'avg_co2' : new_Avg_c02                    
                    }]
            }  


    return print(meta)

##############################################################################################

## Return avg_temp by season
def get_season() :

    #Calculate Mean temp by country and by seasons from season_df
    season_country_group_df = season_df.groupby(['Area','Months']).mean()

    #Drop field1
    season_country_mean= season_country_group_df.drop('field1', 1)

    #Get Years 
    year = season_country_mean.columns

    #Get unique Countries 
    country_list = season_country_mean.index
    countries = [item[0] for item in country_list]
    unique_countries = []
    for item in countries:
        if(item not in unique_countries):
            unique_countries.append(item)

    #Create an object with keys [countries, year, winter,Spring,Summer and Fall]
    # Set 'Data Found ' to 'Yes' or 'No' for each country 
    #Initialize the arrays
    season_list = []
    avg_temp_list =[]

    #Get seasons for each country
    for country in unique_countries:
        #clear the counter for the next country
        avg_temp_list.clear()

        #Append each country with its data to a list
        country_df = season_country_mean.loc[country,:]
        avg_temp_list.append(country_df.values)

        #Find the length for no. of seasons
        print('No. of seasons: ', format(len(avg_temp_list[0])))

        #Create an object if length is equal to 4
        if len(avg_temp_list[0]) == 4:
            season_obj ={
                'Country': country,
                'Year': year,
                'Winter':avg_temp_list[0][0],
                'Spring':avg_temp_list[0][1],
                'Summer':avg_temp_list[0][2],
                'Fall':avg_temp_list[0][3],
                'Data Found':'yes'
                }
        #If length is 3, check to see if Countries have long summer and dry winter . If so, exclude 'fall'
        elif len(avg_temp_list[0]) == 3 :
            print(f'...............\n Country: {country}')
            print(season_country_mean.loc[country,:])
            print(avg_temp_list[0])
            season_obj ={
                'Country': country,
                'Year': year,
                'Winter':avg_temp_list[0][0],
                'Spring':avg_temp_list[0][1],
                'Summer':avg_temp_list[0][2],
                'Data Found':'yes'
                }
        #Set No data found if length is < 3
        else:
            print(f'..........\nCountry: {country}')
            print(season_country_mean.loc[country,:])
            print(avg_temp_list[0])
            season_obj ={ 'Data Found' :'No' }

        #Append the object to a list
        season_list.append(season_obj)
    return season_list


###############################################################################
#Call the functions to check
#launchPage()
avg_temp_by_season = get_season()
print(avg_temp_by_season)

    


