from flask import Flask, jsonify, render_template
from climate import launchPage

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
    print(launch_data)
    return render_template("index.html", meta_data_launch=launch_data)

 
if __name__ == '__main__':
    app.run(debug=True)