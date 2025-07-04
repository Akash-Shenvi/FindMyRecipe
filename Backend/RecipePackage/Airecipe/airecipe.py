from flask import Flask, request, jsonify,Blueprint
import os,json
import google.generativeai as genai

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
    
@airecipe.route('/ai-recipe-qusn', methods=['POST'])
def ai_recipe_qusn():
    data= request.get_json()
    promptdata=data['prompt']
    print(promptdata)
    airesponse = get_gemini_response(promptdata)
    return jsonify({"status":True,"answer":airesponse})
    

