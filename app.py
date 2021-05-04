from flask import Flask, jsonify, render_template
from climate import launchPage, get_season

#################################################
# Flask Setup
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################

@app.route("/")
def welcome():
    launch_data = launchPage()
    # print(launch_data)
    return render_template("index.html", meta_data_launch=launch_data)


@app.route("/map_data")
def initMap():
    launch_data = launchPage()
    # print(launch_data)
    return jsonify(launch_data)

@app.route("/plot_data")
def getPlots(country):
    plot_data = {
        seasonalData: get_season(), 
        #annualData: function_name()
    }
    return jsonify(plot_data)

 


 
if __name__ == '__main__':
    app.run(debug=True)
    