from flask import Flask, request, jsonify,Blueprint
import os
import google.generativeai as genai


genai.configure(api_key="AIzaSyA9RN5AkCjhI8SS3Za0dW7QnKuxuKYrMgM")

airecipe = Blueprint('airecipe', __name__)


def get_gemini_response(prompt_text):
    """
    Sends a prompt to the Gemini API and returns the text response.
    """
    model = genai.GenerativeModel('gemini-1.5-flash')

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

    # Basic validation: Check if 'prompt' key exists in the JSON
    if not data or 'prompt' not in data:
        return jsonify({"error": "Invalid request: 'prompt' field is missing."}), 400

    user_prompt = data['prompt']
    print(f"Received prompt: '{user_prompt}'")

    # Get response from Gemini AI
    ai_response = get_gemini_response(user_prompt)
    print(f"Sending AI response: '{ai_response[:100]}...'") # Print first 100 chars

    # Return the AI's response as JSON
    return jsonify({"answer": ai_response})
        
        
