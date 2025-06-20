from flask import Flask, jsonify, request,Blueprint
import pandas as pd
import os

import re
import csv

# Load CSV
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_PATH = os.path.join(BASE_DIR, 'cuisines.csv')
df = pd.read_csv(DATASET_PATH)

recipe=Blueprint('recipe',__name__)

# Clean specific fields


@recipe.route("/cuisines", methods=["GET"])
def get_cuisines():
    cuisines = sorted(df['cuisine'].dropna().unique().tolist())
    return jsonify({"cuisines": cuisines})

@recipe.route("/courses", methods=["GET"])
def get_courses():
    courses = sorted(df['course'].dropna().unique().tolist())
    return jsonify({"courses": courses})

@recipe.route("/diets", methods=["GET"])
def get_diets():
    diets = sorted(df['diet'].dropna().unique().tolist())
    return jsonify({"diets": diets})

# 🔥 New: Filter recipes by cuisine, course, diet
@recipe.route("/recipes", methods=["GET"])
def get_recipes():
    # Get multiple values for each filter type
    cuisines = request.args.getlist('cuisine')
    courses = request.args.getlist('course')
    diets = request.args.getlist('diet')

    limit = int(request.args.get('limit', 20))
    page = int(request.args.get('page', 1))

    filtered = df.copy()

    # Normalize and filter each
    if cuisines:
        cuisines = [c.lower().strip() for c in cuisines]
        filtered = filtered[filtered['cuisine'].str.lower().str.strip().isin(cuisines)]

    if courses:
        courses = [c.lower().strip() for c in courses]
        filtered = filtered[filtered['course'].str.lower().str.strip().isin(courses)]

    if diets:
        diets = [d.lower().strip() for d in diets]
        filtered = filtered[filtered['diet'].str.lower().str.strip().isin(diets)]

    result = filtered[['name', 'prep_time', 'image_url', 'cuisine', 'course', 'diet']].dropna()

    start = (page - 1) * limit
    end = start + limit
    paginated = result.iloc[start:end]

    return jsonify({
        "total": len(result),
        "page": page,
        "limit": limit,
        "recipes": paginated.to_dict(orient='records')
    })


@recipe.route('/recipe', methods=['GET'])
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

@recipe.route('/search', methods=['GET'])
def smart_search_recipe_by_name():
    raw_query = request.args.get('query', '').strip().lower()
    if not raw_query:
        return jsonify({'error': 'Query parameter required'}), 400

    limit = int(request.args.get('limit', 20))
    page = int(request.args.get('page', 1))

    # Get filters
    cuisine_filters = request.args.getlist('cuisine')
    course_filters = request.args.getlist('course')
    diet_filters = request.args.getlist('diet')

    # Clean query text
    cleaned = re.sub(r'\b(how to|make|cook|prepare|recipe|for|a|the|of|with)\b', '', raw_query)
    tokens = [t.strip() for t in cleaned.split() if t.strip()]

    if not tokens:
        return jsonify({'error': 'No valid search terms found'}), 400

    def matches_tokens(name):
        name_lower = name.lower()
        return all(token in name_lower for token in tokens)

    # Filter dataset
    filtered = df.copy()

    # Apply name search
    filtered = filtered[filtered['name'].apply(matches_tokens)]

    # Apply filters if present
    if cuisine_filters:
        filtered = filtered[filtered['cuisine'].isin(cuisine_filters)]
    if course_filters:
        filtered = filtered[filtered['course'].isin(course_filters)]
    if diet_filters:
        filtered = filtered[filtered['diet'].isin(diet_filters)]

    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit

    result = filtered[['name', 'prep_time', 'image_url', 'cuisine', 'course', 'diet']].dropna()
    paginated = result.iloc[start:end]

    return jsonify({
        'query': raw_query,
        'tokens': tokens,
        'filters': {
            'cuisine': cuisine_filters,
            'course': course_filters,
            'diet': diet_filters
        },
        'total': total,
        'page': page,
        'limit': limit,
        'results': paginated.to_dict(orient='records')
    })




@recipe.route('/search-by-ingredients', methods=['POST'])
def search_by_ingredients():
    data = request.get_json()
    user_ingredients = data.get('ingredients', [])
    if not user_ingredients or not isinstance(user_ingredients, list):
        return jsonify({'error': 'Provide ingredients as a list'}), 400

    limit = int(request.args.get('limit', 20))
    page = int(request.args.get('page', 1))

    def match_score(row):
        recipe_ings = row['ingredients']
        if not isinstance(recipe_ings, str):
            return 0.0
        recipe_ings = [ing.strip().lower() for ing in recipe_ings.split(',')]
        match_count = sum(1 for ing in user_ingredients if ing.lower() in recipe_ings)
        return match_count / len(recipe_ings) if recipe_ings else 0.0

    df['match_percent'] = df.apply(match_score, axis=1)
    filtered = df[df['match_percent'] > 0].sort_values(by='match_percent', ascending=False)

    total = len(filtered)
    start = (page - 1) * limit
    end = start + limit

    result = filtered[['name', 'prep_time', 'image_url', 'cuisine', 'course', 'diet', 'ingredients', 'match_percent']].dropna()
    paginated = result.iloc[start:end]

    return jsonify({
        'matched_ingredients': user_ingredients,
        'total': total,
        'page': page,
        'limit': limit,
        'recipes': paginated.to_dict(orient='records')
    })


import re

@recipe.route('/ingredients', methods=['GET'])
def get_ingredients():
    ingredients = []

    # Build absolute path using os module
    base_dir = os.path.dirname(os.path.abspath(__file__))
    file_path = os.path.join(base_dir, 'ingredient_6L.csv')

    # Read the CSV and collect ingredient names
    with open(file_path, mode='r', encoding='utf-8') as file:
        reader = csv.reader(file, delimiter=';')
        for row in reader:
            if len(row) > 1:
                ingredients.append(row[1].strip())

    # Return ingredients in expected format
    return jsonify({"ingredients": ingredients})






@recipe.route('/similar-recipes', methods=['GET'])
def get_similar_recipes():
    name = request.args.get('name', '').strip().lower()
    if not name:
        return jsonify({'error': 'Recipe name required'}), 400

    # Try exact match first
    recipe_row = df[df['name'].str.lower() == name]

    # If no exact match, try partial match
    if recipe_row.empty:
        partial_matches = df[df['name'].str.lower().str.contains(name)]
        if not partial_matches.empty:
            recipe_row = partial_matches.iloc[[0]]  # Pick first partial match

    # Still no match?
    if recipe_row.empty:
        return jsonify({'error': f'Recipe not found for: {name}'}), 404

    recipe = recipe_row.iloc[0]
    target_cuisine = recipe.get('cuisine', '')
    target_course = recipe.get('course', '')
    target_ingredients = recipe.get('ingredients', '').lower()
    target_diet = recipe.get('diet', '').strip().lower()

    # Exclude the original recipe
    candidates = df[df['name'].str.lower() != recipe['name'].lower()].copy()

    # 🔒 Apply diet filter: if vegetarian, show only vegetarian
    if target_diet == 'vegetarian':
        candidates = candidates[candidates['diet'].str.lower() == 'vegetarian']

    # Similarity logic
    def is_similar(row):
        score = 0
        if row['cuisine'] == target_cuisine:
            score += 1
        if row['course'] == target_course:
            score += 1
        if isinstance(row['ingredients'], str):
            common = set(target_ingredients.split(',')).intersection(set(row['ingredients'].lower().split(',')))
            if len(common) >= 2:
                score += 1
        return score >= 2

    similar = candidates[candidates.apply(is_similar, axis=1)]

    # 🔁 Fallback to ingredient-based if too few
    if len(similar) < 15:
        keywords = [word.strip() for word in target_ingredients.split(',') if word.strip()]
        if keywords:
            primary = keywords[0]
            fallback = candidates[candidates['ingredients'].str.lower().str.contains(primary, na=False)]
            similar = pd.concat([similar, fallback]).drop_duplicates(subset='name')

    # 🔁 Fallback to random if still not enough
    if len(similar) < 15:
        remaining = candidates[~candidates['name'].isin(similar['name'])]
        extra = remaining.sample(min(15 - len(similar), len(remaining)))
        similar = pd.concat([similar, extra])

    # Return final results
    result = similar[['name', 'prep_time', 'image_url', 'cuisine', 'course', 'diet']].dropna().head(15)

    return jsonify({
        "original": recipe['name'],
        "diet": target_diet or 'unknown',
        "similar_count": len(result),
        "similar_recipes": result.to_dict(orient='records')
    })

