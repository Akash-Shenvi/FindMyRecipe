from flask import Flask
from flask_cors import CORS
import os,json,datetime
from RecipePackage.Auth.auth import authp
from RecipePackage.Models import config
from RecipePackage.Mail.mailsender import init_mail, send_email
from RecipePackage.Models.models import db
from RecipePackage.Models.config import apply_config
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from authlib.integrations.flask_client import OAuth
from RecipePackage.oauth import oauth, configure_oauth
from RecipePackage.Recipes.recipes import recipe


app = Flask(__name__)
configure_oauth(app)
with open(os.path.join(os.path.dirname(__file__), '../config.json')) as f:
    config_data = json.load(f)
SECRET_KEY = config_data['secret_key']

print(SECRET_KEY)






apply_config(app)
jwt = JWTManager(app)
app.config['JWT_SECRET_KEY'] = SECRET_KEY  
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = datetime.timedelta(days=30)

db.init_app(app)
CORS(app)

migrate = Migrate(app, db)
with app.app_context():
    db.create_all()

app.config.from_object(config)

app.register_blueprint(authp, url_prefix='/auth')
app.register_blueprint(recipe, url_prefix='/recipes')

init_mail(app)





# @app.route("/send-mail")
# def test_mail():
#     send_email(
#         subject="Guess Me!",
#         recipient="ganpati.shenvi@gmail.com",
#         body="Testing Email."
#     )
#     return "Mail sent!"

@app.route('/')
def index():
    return 'Hello from the main application', 200



