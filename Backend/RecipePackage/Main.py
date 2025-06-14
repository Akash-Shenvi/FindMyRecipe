from flask import Flask
from flask_cors import CORS
from RecipePackage.auth.auth import authp


app = Flask(__name__)
CORS(app)

app.register_blueprint(authp, url_prefix='/auth')


@app.route('/')
def index():
    return 'Hello from the main application', 200



