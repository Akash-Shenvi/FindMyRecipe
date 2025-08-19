from flask import Flask, request, jsonify,Blueprint
import os,json
import google.generativeai as genai
import json
from flask_jwt_extended import jwt_required, get_jwt_identity
from RecipePackage.Models.models import Aisavedrecipe, db

with open(os.path.join(os.path.dirname(__file__),'../../config.json')) as a:
    data = json.load(a)["gemini"]
# print(data)
API_KEY = data["apikey"]
MODEL = data["model"]
genai.configure(api_key=API_KEY)

airecipe = Blueprint('airecipe', __name__)


def get_gemini_response(prompt_text):
    """
    Sends a prompt to the Gemini API and returns the text response.
    """
    
    model = genai.GenerativeModel(MODEL)

    try:
        response = model.generate_content(prompt_text)
        return response.text
    except Exception as e:
        print(f"An error occurred while calling Gemini API: {e}")
        
@airecipe.route('/ask', methods=['POST'])

def ask_ai():
    """
    API endpoint to receive a prompt from the frontend/client and
    send it to the Gemini AI, then return the AI's response.
    """
    # Get JSON data from the request body
    data = request.get_json()
    print("entered1")
    print(data)

    # Basic validation: Check if 'prompt' key exists in the JSON
    if not data or 'prompt' not in data:
        return jsonify({"error": "Invalid request: 'prompt' field is missing."}), 400

    user_prompt = data['prompt']
    print(f"Received prompt: '{user_prompt}'")

    # Get response from Gemini AI
    prompts = f"""
Get me the recipe for "{user_prompt}" in the following format:
Recipe Name, Cuisine, Course, Diet, Prep Time, Description, Ingredients, Instructions.
If the input does not contain a valid food item or recipe name, respond with: "Enter a valid food item or a recipe."
""".strip()

    print(prompts)
    ai_response = get_gemini_response(prompts)
    

    # Return the AI's response as JSON
    return jsonify({"answer": ai_response})
        
        
"""This Route if for making recipes with few questions to the user.
"""
    
import re
import json
from flask import request, jsonify

@airecipe.route('/ai-recipe-qusn', methods=['POST'])
def ai_recipe_qusn():
    data = request.get_json()
    print(data)

    meal = data.get("mealType")
    ingredient = data.get("mainIngredient").strip()
    spice = data.get("spiceLevel")
    cuisine = data.get("cuisine")
    time = data.get("timeAvailable")

    promptdata = f"""
    Generate a {spice} {cuisine} recipe for {meal} using {ingredient}.
    The recipe should take about {time} to prepare.
    Return the response strictly in this JSON format:

{{
  "name": "...",
  "prep_time": ...,
  "ingredients": ["...", "..."],
  "steps": ["...", "..."]
}}
    """
    print("Prompt:", promptdata)

    airesponse = get_gemini_response(promptdata)
    print("Raw AI Response:")
    print(airesponse)

    # ✅ Clean any ```json ... ``` or ``` blocks
    cleaned = re.sub(r"```(?:json)?\s*([\s\S]*?)```", r"\1", airesponse).strip()
    print("Cleaned AI Response:")
    print(cleaned)

    # ✅ Now try to parse cleaned string into dict
    try:
        parsed = json.loads(cleaned)
    except json.JSONDecodeError as e:
        print("JSON decode failed:", e)
        return jsonify({"status": False, "error": "AI response not valid JSON"}), 400

    print("Parsed Recipe:")
    print(parsed)

    return jsonify({"status": True, "answer": parsed})

@airecipe.route('/ai-recipe-save', methods=['POST'])
@jwt_required()
def ai_recipe_save():
    
    current_user_id = get_jwt_identity()
    data = request.get_json()
    recipe_name = data['name']
    print("Current User ID:", current_user_id)
    new_recipe= Aisavedrecipe(
        user_id=current_user_id,
        recipe=data,
        recipe_name=recipe_name,
        
    )
    db.session.add(new_recipe)
    db.session.commit()
    return jsonify({"status": True, "message": "Recipe saved successfully"}), 200

@airecipe.route('/ai-recipe-saved', methods=['GET'])
@jwt_required()
def ai_recipe_saved():
    current_user_id = get_jwt_identity()
    print("Current User ID:", current_user_id)

    saved_recipes = Aisavedrecipe.query.filter_by(user_id=current_user_id).all()

    # Extract only recipe_id and recipe name
    recipes_list = [
        {
            "id": recipe.recipe_id,
            "name": recipe.recipe.get("name", "Unnamed Recipe")
        }
        for recipe in saved_recipes
    ]

    return jsonify({"status": True, "recipes": recipes_list}), 200

@airecipe.route('/ai-recipe-view/<int:recipe_id>', methods=['GET'])
@jwt_required()
def ai_recipe_view(recipe_id):
    current_user_id = get_jwt_identity()
    print("Current User ID:", current_user_id)

    recipe = Aisavedrecipe.query.filter_by(recipe_id=recipe_id, user_id=current_user_id).first()

    if not recipe:
        return jsonify({"status": False, "message": "Recipe not found"}), 404

    return jsonify({"status": True, "recipe": recipe.recipe}), 200
    

@airecipe.route('/ai-recipe-delete/<int:recipe_id>', methods=['DELETE'])
@jwt_required()
def ai_recipe_delete(recipe_id):
    current_user_id = get_jwt_identity()
    print("Current User ID:", current_user_id)

    recipe = Aisavedrecipe.query.filter_by(recipe_id=recipe_id, user_id=current_user_id).first()

    if not recipe:
        return jsonify({"status": False, "message": "Recipe not found"}), 404

    db.session.delete(recipe)
    db.session.commit()

    return jsonify({"status": True, "message": "Recipe deleted successfully"}), 200