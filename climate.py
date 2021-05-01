# dependencies
import pandas as pd
import numpy as np
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, inspect, join, outerjoin, MetaData, Table

connect_string = "sqlite:///static/data/climateDB.db"


engine = create_engine(connect_string) 

Base = automap_base()

Base.prepare(engine, reflect =True)

print(Base.classes.keys())

Emission = Base.classes.CO2_emission

Temp_change = Base.classes.temp_change

#print(Emission)

session = Session(bind = engine)

results_emission = session.query(Emission).filter(Emission.Year >= 1961)

#print(results) 

emission_df = pd.read_sql(results_emission.statement, session.connection())

print(emission_df.head())

results_temp = session.query(Temp_change).filter(Temp_change.ElementCode == 7271)

#print(results) 

temp_df = pd.read_sql(results_temp.statement, session.connection())

print(temp_df.head())


clean_df = temp_df.isna().sum()

print(clean_df)



