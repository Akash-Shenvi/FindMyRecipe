from flask import Flask, jsonify, request
import pandas as pd
import os
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend to access

# Load CSV
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'cuisines.csv')
df = pd.read_csv(DATASET_PATH)

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

# 🔥 New: Filter recipes by cuisine, course, diet
@app.route("/recipes", methods=["GET"])
def get_recipes():
    cuisine = request.args.get('cuisine')
    course = request.args.get('course')
    diet = request.args.get('diet')

    filtered = df.copy()

    if cuisine:
        filtered = filtered[filtered['cuisine'] == cuisine]
    if course:
        filtered = filtered[filtered['course'] == course]
    if diet:
        filtered = filtered[filtered['diet'] == diet]

    result = filtered[['name', 'prep_time']].dropna().to_dict(orient='records')
    return jsonify({"recipes": result})


if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True,port=5001)
