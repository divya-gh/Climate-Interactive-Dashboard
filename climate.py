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
Country_demo = Base.classes.country_demo
#print(Emission)

# Create a session (link) from Python to the sqlite DB
session = Session(bind = engine)

#Filter the data for the year >= 1961
results_emission = session.query(Emission).filter(Emission.Year >= 1961)
emission_df = pd.read_sql(results_emission.statement, session.connection())

#print(emission_df.head())
results_temp = session.query(Temp_change)
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

results_Demo = session.query(Country_demo)
demo_df = pd.read_sql(results_Demo.statement, session.connection(),index_col='index')

demo_sorted_df = demo_df.sort_values(by=["name"]).reset_index(drop=True)
demo_sorted_df = demo_sorted_df.rename({"name":"Area","population":"Population",
                                        "density":"Density",
                                        "land-size":"Land Size","image_url":"Images",
                                        "latitude":"Lat","longitude":"Lng"},axis='columns')

session.close() 


##===================================================================##
##Functions
##====================================================================##

## Return launchPage

def launchPage() :   

    #calculate overall avg_co2 emission per country
    avg_co2 =  emission_df.groupby("Entity").agg({'AnnualCO2emissions':'mean'})
    avg_co2 = round(avg_co2/1000000,3) ## converting GT to Mega ton for the tooltip
    avg_co2.reset_index(inplace=True)
    avg_co2 = avg_co2.rename({'Entity':'Area', 'AnnualCO2emissions':'AnnualCO2emissions'}, axis='columns')

    #Merge Temp_change by meteor year per country to Avg_Co2 Emission df
    merged_co2_country =meteor_id_df.merge(avg_co2, how = 'inner',  on="Area")

    #find null
    merged_co2_country.isna().sum()
    #fill 0
    merged_co2_country = merged_co2_country.fillna(0)
    #find null again
    merged_co2_country.isna().sum()

    #merge population data to Temp and Co2 Emission df
    popu_data = merged_co2_country.merge(demo_sorted_df, how = 'left', on ="Area" )

    popu_data = popu_data[['Area', 'Population','Density', 'Land Size', 'Images', 'Lat','Lng']].fillna(0).set_index("Area",drop=True)
    merged_co2_country.set_index("Area",inplace=True)

    #Get New Countries from the merged DF
    New_Countries = merged_co2_country.index

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

    for country in New_Countries:
        temp_co2_obj = {
                        "Country":country,
                        "Avg Temp Change":merged_co2_country.loc[country,"avg_temp"],
                        "Avg Co2 Change":merged_co2_country.loc[country,"AnnualCO2emissions"],
                        "Population":popu_data.loc[country,"Population"],
                        "Density":popu_data.loc[country,"Density"],
                        "Land Size":popu_data.loc[country,"Land Size"],
                        "Images":popu_data.loc[country,"Images"],
                        "Lat":popu_data.loc[country,"Lat"],
                        "Lng":popu_data.loc[country,"Lng"],
                        }
        meta.append(temp_co2_obj)

    return meta , New_Countries



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

def get_unique_countries(): 
    
    meta, unique_countries = launchPage()

    # country_list = meteor_id_df.index
    # print(len(country_list))
    # unique_countries = []
    # for item in country_list:
    #     if(item not in unique_countries):
    #         unique_countries.append(item)
    return list(np.ravel(unique_countries))



###############################################################################################
## Function to calculate avg_temp by season
#--------------------------------------------

def get_season(country='United States of America'):

    #Get avg_temp change by season for the selected country
    season_country_mean = season_df.loc[season_df['Area'] == country] 

    #Drop unwanted fields and reset index
    season_country_mean = season_country_mean.drop(['field1', 'Element', 'Unit'], 1).reset_index(drop=True)

    #Get years data
    year = season_country_mean.columns.drop(['Area', 'Months'])

    #Create a list of objects with keys [countries, year, winter,Spring,Summer and Fall]
    # Set 'Data Found ' to 'Yes' or 'No' based on the length of data returned

    #Initialize the arrays
    season_list = []

    if len(season_country_mean) == 4:
        season_obj ={
            'Country': country,
            'Year': list(np.ravel(year)),
            'Winter':list(np.ravel(season_country_mean.iloc[0,2:].values)),
            'Spring':list(np.ravel(season_country_mean.iloc[1,2:].values)),
            'Summer':list(np.ravel(season_country_mean.iloc[2,2:].values)),
            'Fall':list(np.ravel(season_country_mean.iloc[3,2:].values)),
            'Data Found':'yes'
            }
    elif len(season_country_mean) == 3 :
        print(f'...............\n Country: {country}')
        print(season_country_mean)
        season_obj ={
            'Country': country,
            'Year':list(np.ravel(year)),
            'Winter':list(np.ravel(season_country_mean.iloc[0,2:].values)),
            'Spring':list(np.ravel(season_country_mean.iloc[1,2:].values)),
            'Summer':list(np.ravel(season_country_mean.iloc[2,2:].values)),
            'Data Found':'yes'
            }
    else:
        print(f'...............\n Country: {country}')
        print(season_country_mean)
        season_obj ={ 'Data Found' :'No' }

    #Append the object to a list
    season_list.append(season_obj)

    return season_list


#################################################################################
# function to return avg_temp by months for each Country
#-----------------------------------------------------------

def get_months(country='United States of America'):

    #Get avg_temp change by season for the selected country
    months_country_mean = month_df.loc[month_df['Area'] == country] 
    months_country_mean.set_index("Months" , inplace=True)

    #Drop unwanted fields
    months_country_mean = months_country_mean.drop(['field1','Area', 'Element', 'Unit'], 1)
    #Get years data
    years = months_country_mean.columns

    # create a lsit of objects for each month
    months_list = []
    # Get months for each country
    months = months_country_mean.index

    #Create an object to hold keys[]
    for year in years:
        mon_obj = {
                  "Year":year
                  }
        for month in months:
            mon_obj[month] = months_country_mean.loc[month , year]        
                
        months_list.append(mon_obj) 
        

    return months_list


#################################################################################
# function to return scatter data of avg_temp and avg_co2 emission by year
#-----------------------------------------------------------

def get_scatter(country='United States of America'):
    #Get Average Temp Change per year for the selected Country , Transpose table and reset index
    temp_country = meteor_df.loc[meteor_df['Area'] == country].drop(['field1','Area','Months', 'Element', 'Unit'], 1).reset_index(drop=True).T.reset_index()
    temp_country= temp_country.rename(columns = {'index':'Year', 0:'Avg Temp'})

    #check for dtypes before merging
    temp_country.dtypes
    #parse df object to datetime object and get only Years
    temp_country['Year'] = pd.to_datetime(temp_country['Year'],format="%Y")
    temp_country['Year'] = pd.DatetimeIndex(temp_country['Year']).year

    #get Co2 Emission Data , drop unwated fields and reset index
    co2_country = emission_df.loc[emission_df['Entity']==country].drop(['Entity', 'Code'], 1).reset_index(drop=True)
    co2_country= co2_country.rename(columns = {'Year':'Year', 'AnnualCO2emissions':'CO2 Emission'})

    #check for data types before merging
    co2_country.dtypes

    #Merge Temp_change Co2 Emission df
    merged_Temp_co2 =temp_country.merge(co2_country, on="Year", left_index=False, right_index=False)

    #convert Co2 Emission to MegaTon
    merged_Temp_co2['CO2 Emission'] = round(merged_Temp_co2['CO2 Emission'].apply(lambda x: x/1000000),3)

    # Get data in a object in a list
    Scatter_obj =  {    "Country":country,
                        "Year":list(np.ravel(merged_Temp_co2['Year'].astype('float64'))),
                        "Avg Temp Change":list(np.ravel(merged_Temp_co2['Avg Temp'])), 
                        "Co2 Emission":list(np.ravel(merged_Temp_co2['CO2 Emission']))
                    }                               
    
    return Scatter_obj

#################################################################################
# function to return launch data for mini map
#-----------------------------------------------------------
def get_country_map(country='Mali'):
    launch_data , countries = launchPage()

    allCountries = pd.DataFrame(launch_data)

    thisCountry = allCountries.loc[allCountries['Country']==country]

    thisCountry = thisCountry.to_dict('r')

    return thisCountry


###############################################################################
#Call the functions to check
#launchPage()
# avg_temp_by_season = get_season()
#print(avg_temp_by_season)


    


if __name__ == '__main__':
    # scatter_data_by_country = get_scatter('China, Hong Kong SAR')
    #print("Launch data\n", scatter_data_by_country)
    # unique_countries = get_unique_countries()
    #print('countries :' , unique_countries)
    # avg_temp_by_months= get_months()
    # print(avg_temp_by_months)
    indvCountryData = get_country_map()
    print(indvCountryData)