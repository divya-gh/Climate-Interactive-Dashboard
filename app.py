# dependencies
import os
#clear Screen
os.system("cls")

import numpy as np
from flask import Flask, jsonify, render_template
import climate 


climate_data = climate
#################################################
# Flask Setup
#################################################
app = Flask(__name__)
app.config['JSON_SORT_KEYS'] = False
#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    launch_data = climate_data.launchPage()
    # print(launch_data)
    return render_template("index.html")


#------------------------------------------------------------------------------------------#
#Functions to get data by country
#------------------------------------------------------------------------------------------#

# Flask Api to to get country, overall avg_temp change/ averall avg_co2 emission per country
@app.route("/launch_data")
def initMap():
    launch_data = climate_data.launchPage()
    return jsonify(launch_data)

#Get Data by Season per country
@app.route("/season_data/<country>")
def get_season_data(country):

    #Call climate.py get data by season per country 
    season_data = climate_data.get_season(country)
    return jsonify(season_data)

@app.route("/months_data/<country>")
def get_months_data(country):

    #Call climate.py get data by months per country
    months_data = climate_data.get_months(country)
    return jsonify(months_data )
 


 
if __name__ == '__main__':
    app.run(debug=True)
    