from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import ast

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Load dataset
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, 'recipes.csv')
df = pd.read_csv(CSV_PATH)

# Safely parse the 'RecipeIngredientParts' column
def parse_ingredients(ingredient_str):
    try:
        parsed = ast.literal_eval(ingredient_str)
        return set(i.strip().lower() for i in parsed if isinstance(i, str) and i.strip())
    except Exception:
        return set()

df['ParsedIngredients'] = df['RecipeIngredientParts'].fillna('[]').apply(parse_ingredients)

@app.route("/api/search-by-ingredients", methods=["POST"])
def search_by_ingredients():
    print("🧪 Received search request")
    data = request.get_json()
    input_ingredients = data.get("ingredients", [])

    if not input_ingredients:
        return jsonify({"error": "No ingredients provided"}), 400

    input_ingredients_set = set(i.strip().lower() for i in input_ingredients)
    matches = []

    for _, row in df.iterrows():
        recipe_ingredients = row['ParsedIngredients']
        common = input_ingredients_set & recipe_ingredients
        score = len(common) / len(recipe_ingredients) if recipe_ingredients else 0

        if score > 0:
            matches.append({
                "_id": row["RecipeId"],
                "title": row["Name"],
                "image_url": row["Images"] if pd.notna(row["Images"]) else "",
                "ingredients": list(recipe_ingredients),
                "match_percent": round(score, 2)
            })

    sorted_matches = sorted(matches, key=lambda x: x["match_percent"], reverse=True)
    return jsonify({"recipes": sorted_matches[:30]})

@app.route("/api/ingredient-suggestions", methods=["GET"])
def ingredient_suggestions():
    all_ingredients = df["ParsedIngredients"].explode().dropna().unique().tolist()
    return jsonify(sorted(all_ingredients))

if __name__ == "__main__":
    app.run(debug=True, port=5001)
