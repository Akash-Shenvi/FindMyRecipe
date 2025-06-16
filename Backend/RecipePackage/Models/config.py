import json
import os

def apply_config(app):
    config_path = os.path.join(os.path.dirname(__file__), '../../config.json')
    with open(config_path) as f:
        config = json.load(f)

    db_conf = config["database"]
    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{db_conf['user']}:{db_conf['password']}"
        f"@{db_conf['host']}/{db_conf['name']}"
    )
    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = config["secret_key"]
