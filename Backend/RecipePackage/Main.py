from flask import Flask
from flask_cors import CORS
from RecipePackage.Auth.auth import authp
from RecipePackage.Models import config
from RecipePackage.Mail.mailsender import init_mail, send_email
app = Flask(__name__)
CORS(app)



app.config.from_object(config)

app.register_blueprint(authp, url_prefix='/auth')
init_mail(app)

# @app.route("/send-mail")
# def test_mail():
#     send_email(
#         subject="Guess Me!",
#         recipient="rani.kini.17@gmail.com",
#         body="Testing Email."
#     )
#     return "Mail sent!"

@app.route('/')
def index():
    return 'Hello from the main application', 200



