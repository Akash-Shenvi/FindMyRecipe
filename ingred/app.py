
from flask import Flask, request, jsonify
import pandas as pd
from flask_cors import CORS
import os
import re

app = Flask(__name__)
CORS(app)

# Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'recipes.csv')
df = pd.read_csv(DATASET_PATH)

# Fill missing values for easier handling
df.fillna('', inplace=True)

# Helper: Clean ingredient list to lowercase strings
def clean_ingredient_list(raw_ingredients):
    if isinstance(raw_ingredients, str):
        parts = re.split(r'[\n,•;\t]', raw_ingredients)
        return [re.sub(r'[^a-zA-Z ]+', '', p).strip().lower() for p in parts if p.strip()]
    return []

# Convert ingredients in DataFrame for faster search
df['ingredients_clean'] = df['RecipeIngredientParts'].apply(clean_ingredient_list)

@app.route("/api/search-by-ingredients", methods=["POST"])
def search_by_ingredients():
    data = request.get_json()
    input_ingredients = [i.lower().strip() for i in data.get("ingredients", [])]
    if not input_ingredients:
        return jsonify({"recipes": []})

    def calculate_match(row_ingredients):
        if not row_ingredients:
            return 0
        matches = len(set(row_ingredients) & set(input_ingredients))
        return matches / len(input_ingredients)

    df['match_percent'] = df['ingredients_clean'].apply(calculate_match)
    matched = df[df['match_percent'] > 0].sort_values(by='match_percent', ascending=False).head(30)

    results = []
    for _, row in matched.iterrows():
        results.append({
            "title": row.get("name", "Untitled"),
            "image_url": row.get("Images", ""),
            "ingredients": row.get("ingredients_clean", []),
            "match_percent": row.get("match_percent", 0),
            "_id": row.get("name", "")
        })

    return jsonify({"recipes": results})

if __name__ == "__main__":
    app.run(debug=True, port=5000)
