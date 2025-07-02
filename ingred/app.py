import os
import google.generativeai as genai
from flask import Flask, request, jsonify

# --- 1. Configure Gemini API (Security Best Practice for API Key) ---
# It's highly recommended to load your API key from an environment variable.
# Before running this script, set your API key in your terminal:
#
#    export GOOGLE_API_KEY="YOUR_API_KEY_HERE"
#
# Replace "YOUR_API_KEY_HERE" with the key you generated from aistudio.google.com
#
# --- IMPORTANT: Do NOT hardcode your API key in production code! ---

try:
    # Configure the client library with your API key
    genai.configure(api_key="AIzaSyA9RN5AkCjhI8SS3Za0dW7QnKuxuKYrMgM")
    print("Gemini API configured successfully.")
except KeyError:
    print("Error: The GOOGLE_API_KEY environment variable is not set.")
    print("Please set it before running the script:")
    print("  export GOOGLE_API_KEY=\"YOUR_API_KEY_HERE\"")
    print("Exiting...")
    exit() # Exit if the API key isn't found

# --- 2. Function to Interact with Gemini API ---
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
        return "Sorry, I couldn't process your request with the AI at the moment. Please try again later."

# --- 3. Flask Backend Application Setup ---
app = Flask(__name__)

@app.route('/')
def index():
    return "Welcome to the Gemini-powered Backend! Send POST requests to /api/ask."

@app.route('/api/ask', methods=['POST'])
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

# --- 4. Run the Flask Application ---
if __name__ == '__main__':
    # Flask will run on http://127.0.0.1:5000/ by default
    # debug=True allows for automatic reloading on code changes and provides a debugger
    app.run(debug=True)