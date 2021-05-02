# dependencies
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

month_df = temp_df.loc[(~temp_df["Months"].isin(selection)) & (temp_df["Months"] != 'Meteorological year') ]



print(temp_df.head())

##===================================================================##
##Functions
##====================================================================##

def launchpage() :
    #meta ={
    #    country : [ countries],
    #    demo_info : [web scraped data],
    #    tool_tip : [c_name: countries,
    #                avg_temp:avg_temp,avg_co2]
    #                population:population
    #                ]
    #   }             
    

    avg_co2 =  emission_df.groupby("Entity").agg({'AnnualCO2emissions':'mean'})
    avg_co2 = round(avg_co2/1000000,3) # converting GT to Mega ton for the tooltip

    #Demo_info = 

    #country name
    country_name = temp_df['Area'].unique()

    # Average Temperature
    avg_temp = 

    return country_name 

#launchpage()





