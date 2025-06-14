from flask import Blueprint

authp = Blueprint('auth', __name__)

@authp.route('/login', methods=['GET'])
def login():
    # Logic for user login
    return 'Hello login page', 200

@authp.route('/', methods=['GET'])
def index():
    return 'Hello from auth blueprint', 200