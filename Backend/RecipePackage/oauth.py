from authlib.integrations.flask_client import OAuth
import os,json
oauth = OAuth()



def configure_oauth(app):
    oauth.init_app(app)
    with open(os.path.join(os.path.dirname(__file__),'../config.json')) as a:
        data=json.load(a)["oauth"]

    # print(data["client_id"])
    client_id=data["client_id"]
    client_secret=data["client_secret"]

    oauth.register(
    name='google',
    client_id=client_id,
    client_secret=client_secret,# Replace with actual value
    access_token_url='https://oauth2.googleapis.com/token',
    access_token_params=None,
    authorize_url='https://accounts.google.com/o/oauth2/auth',
    authorize_params=None,
    api_base_url='https://www.googleapis.com/oauth2/v1/',
    userinfo_endpoint='https://www.googleapis.com/oauth2/v3/userinfo',
    client_kwargs={
        'scope': 'openid email profile',
    },
    server_metadata_url='https://accounts.google.com/.well-known/openid-configuration',
)
