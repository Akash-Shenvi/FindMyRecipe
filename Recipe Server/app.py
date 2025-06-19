from flask import Flask, jsonify, request
import pandas as pd
import os
from flask_cors import CORS
import re
app = Flask(__name__)
CORS(app)  # Allow frontend to access

# Load CSV
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'cuisines.csv')
df = pd.read_csv(DATASET_PATH)



# Clean specific fields


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
    limit = int(request.args.get('limit', 20))
    page = int(request.args.get('page', 1))

    filtered = df.copy()

    if cuisine:
        filtered = filtered[filtered['cuisine'] == cuisine]
    if course:
        filtered = filtered[filtered['course'] == course]
    if diet:
        filtered = filtered[filtered['diet'] == diet]

    result = filtered[['name', 'prep_time', 'image_url','cuisine','course','diet']].dropna()

    start = (page - 1) * limit
    end = start + limit
    paginated = result.iloc[start:end]

    return jsonify({
        "total": len(result),
        "page": page,
        "limit": limit,
        "recipes": paginated.to_dict(orient='records')
    })

@app.route('/recipe', methods=['GET'])
def get_recipe_by_name():
    name = request.args.get('name')
    if not name:
        return jsonify({'error': 'Name parameter required'}), 400

    recipe = df[df['name'].str.lower() == name.lower()]
    if recipe.empty:
        return jsonify({'error': 'Recipe not found'}), 404

    result = recipe.iloc[0].to_dict()

    # Clean text fields
    def clean_field(text):
        if pd.isna(text): return ''
        text = re.sub(r'[\t\r\n]+', ' ', text)
        return re.sub(r'\s{2,}', ' ', text).strip()

    for field in ['description', 'instructions']:
        result[field] = clean_field(result.get(field, ''))

    # Split ingredients into list: split by comma or numbered bullets or '•' or newlines or tabs
    ingredients_raw = result.get('ingredients', '')
    ingredients_clean = re.split(r'(?<=[a-zA-Z])\s*(?=\d|\•|\-)', ingredients_raw)
    ingredients_clean = [re.sub(r'\s{2,}', ' ', i).strip() for i in ingredients_clean if i.strip()]
    result['ingredients'] = ingredients_clean

    return jsonify(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0',debug=True,port=5001)
