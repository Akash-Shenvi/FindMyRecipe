from flask import Flask, jsonify
import pandas as pd
from flask_cors import CORS
import os
app = Flask(__name__)
CORS(app)

# Load dataset once at startup
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_PATH = os.path.join(BASE_DIR, "cuisines.csv")
print(DATA_PATH)
df = pd.read_csv(DATA_PATH)

@app.route("/cuisines", methods=["GET"])
def get_cuisines():
    cuisines = sorted(df['cuisine'].dropna().unique().tolist())
    return jsonify({"cuisines": cuisines})


@app.route("/courses", methods=["GET"])
def get_courses():
    courses = sorted(df['course'].dropna().unique().tolist())
    return jsonify({"courses": courses})

@app.route("/diets", methods=["GET"])
def get_diets():
    diets = sorted(df['diet'].dropna().unique().tolist())
    return jsonify({"diets": diets})

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True,port=5001)
