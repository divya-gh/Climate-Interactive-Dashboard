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
#print(Base.classes.keys())

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

#print(emission_df.head())
results_temp = session.query(Temp_change)

#print(results) 

temp_df = pd.read_sql(results_temp.statement, session.connection())

selection = ['DecJanFeb', 'MarAprMay', 'JunJulAug', 'SepOctNov']

season_df = temp_df.loc[temp_df["Months"].isin(selection)]

#filter by months
month_df = temp_df.loc[(~temp_df["Months"].isin(selection)) & (temp_df["Months"] != 'Meteorological year') ]

# filter Meteorological year
meteor_df = temp_df.loc[temp_df["Months"] == 'Meteorological year' ]
meteor_df_new = meteor_df.copy()

# Calculate avg temp per Meteorological year
meteor_df_new['avg_temp']= round(meteor_df_new.mean(axis =1),3)
meteor_id_df = meteor_df_new.set_index('Area')

session.close() 


##===================================================================##
##Functions
##====================================================================##

## Return launchPage

def launchPage() :   

    #calculate overall avg_co2 emission per country
    avg_co2 =  emission_df.groupby("Entity").agg({'AnnualCO2emissions':'mean'})
    avg_co2 = round(avg_co2/1000000,3) ## converting GT to Mega ton for the tooltip

    #Merge Temp_change by meteor year per country to Avg_Co2 Emission df
    merged_co2_country =meteor_id_df.merge(avg_co2, how = 'right',  left_index=True, right_index=True,)

    #find null
    merged_co2_country.isna().sum()
    #fill 0
    merged_co2_country = merged_co2_country.fillna(0)
    #find null again
    merged_co2_country.isna().sum()

    #Get New Countries from the merged DF
    New_Countires = merged_co2_country.index

    #Create a dictionary holding above values
     #meta = [{
    #    'country' : country_name,
    #    'demo_info' : [web scraped data],
    #    'tool_tip' : [{'c_name': country_name,
    #                'avg_temp':avg_temp,
    #                'avg_co2' : new_Avg_c02,
    #                'population':population from web scraping
    #                }]
    #   } ]

    #New Code---------------------------------------------------

    meta = []

    for country in New_Countires:
        temp_co2_obj = {
                        "Country":country,
                        "Avg Temp Change":merged_co2_country.loc[country,"avg_temp"],
                        "Avg Co2 Change":merged_co2_country.loc[country,"AnnualCO2emissions"],
                        }
        meta.append(temp_co2_obj)




    return meta





##############################################################################################
#Function to calculate mean and years for seasonal and months data
#------------------------------------------------------------------

def get_mean_and_year(df):
    #Groupby countries and months/seasons to get avg.change in temp for each country
    grouped_df = df.groupby(['Area','Months'],sort=False).mean()

    #Rename and drop field1
    grouped_df_mean= grouped_df.drop('field1', 1)
    
    #get years
    year = grouped_df_mean.columns
    
    return grouped_df_mean, year 


#############################################################################################
#Function to get unique Countries
#-----------------------------------------

def get_unique_countries(mean_df):     
    country_list = mean_df.index
    countries = [item[0] for item in country_list]
    unique_countries = []
    for item in countries:
        if(item not in unique_countries):
            unique_countries.append(item)
    return unique_countries



###############################################################################################
## Function to calculate avg_temp by season
#--------------------------------------------

def get_season():

    #Call get_mean_and_year function to get avg_temp and years
    season_country_mean, year = get_mean_and_year(season_df) 

    #Call function to get unique Countries 
    unique_countries = get_unique_countries(season_country_mean)

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
        #print('No. of seasons: ', format(len(avg_temp_list[0])))

        #Create an object if length is equal to 4
        if len(avg_temp_list[0]) == 4:
            season_obj ={
                'Country': country,
                'Year': list(np.ravel(year)),
                'Winter':list(np.ravel(avg_temp_list[0][0])),
                'Spring':list(np.ravel(avg_temp_list[0][1])),
                'Summer':list(np.ravel(avg_temp_list[0][2])),
                'Fall':list(np.ravel(avg_temp_list[0][3])),
                'Data Found':'yes'
                }
        #If length is 3, check to see if Countries have long summer and dry winter . If so, exclude 'fall'
        elif len(avg_temp_list[0]) == 3 :
            #print(f'...............\n Country: {country}')
            #print(season_country_mean.loc[country,:])
            #print(avg_temp_list[0])
            season_obj ={
                'Country': country,
                'Year': list(np.ravel(year)),
                'Winter':list(np.ravel(avg_temp_list[0][0])),
                'Spring':list(np.ravel(avg_temp_list[0][1])),
                'Summer':list(np.ravel(avg_temp_list[0][2])),
                'Data Found':'yes'
                }
        #Set No data found if length is < 3
        else:
            #print(f'..........\nCountry: {country}')
            #print(season_country_mean.loc[country,:])
            #print(avg_temp_list[0])
            season_obj ={ 'Data Found' :'No' }

        #Append the object to a list
        season_list.append(season_obj)
    return season_list


#################################################################################
# function to return avg_temp by months for each Country
#-----------------------------------------------------------

def get_months():
    #Call get_mean_and_year function to get avg_temp and years
    months_country_mean, year = get_mean_and_year(month_df) 

    #Call the function to get unique Countries 
    unique_countries = get_unique_countries(months_country_mean)

    # create an object for each month and append it to a list
    months_list = []
    for country in unique_countries:
        country_df = months_country_mean.loc[country,:]
        #print(country_df)
        # Get months for each country
        month_index = country_df.index

        months_obj ={
        'Country': country,       
                }
        if len(month_index) > 4:
            months_obj['Year'] =list(np.ravel(year))
            for item in month_index:
                months_obj[item] = list(np.ravel(country_df.loc[item].values)),

            #print(country_df.loc[item].values)
            months_obj["Data Found"] = 'Yes'    

        else:
            months_obj["Data Found"] = 'No' 
            #print(f'...............\n Country: {country}\n')
            #print(country_df)
            #print(months_obj)

        months_list.append(months_obj)

    return months_list



###############################################################################
#Call the functions to check
#launchPage()
avg_temp_by_season = get_season()
#print(avg_temp_by_season)

avg_temp_by_months= get_months()
#print(avg_temp_by_months)
    


