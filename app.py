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
    return render_template("index.html", meta_data_launch=list(launch_data))


@app.route("/map_data")
def initMap():
    launch_data = climate_data.launchPage()
    return jsonify(launch_data)

@app.route("/season_data")
def getPlots():
    #season_data = {
    #    seasonalData: climate_data.get_season(), 
    #    #annualData: function_name()
    #}
    season_data = climate_data.get_season()
    return jsonify(season_data)

@app.route("/months_data")
def getMonthsPlots():
    #season_data = {
    #    seasonalData: climate_data.get_season(), 
    #    #annualData: function_name()
    #}
    months_data = climate_data.get_months()
    return jsonify(months_data )
 


 
if __name__ == '__main__':
    app.run(debug=True)
    