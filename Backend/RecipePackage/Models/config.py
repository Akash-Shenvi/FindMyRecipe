import json
import os

# Load entire config file
with open(os.path.join(os.path.dirname(__file__), '../../config.json')) as f:
    config = json.load(f)

# Access only the "database" part
db_conf = config["database"]
# print(db_conf)

SQLALCHEMY_DATABASE_URI = (
    f"mysql+pymysql://{db_conf['user']}:{db_conf['password']}"
    f"@{db_conf['host']}/{db_conf['name']}"
)

SQLALCHEMY_TRACK_MODIFICATIONS = False
SECRET_KEY = config["secret_key"]
# print(SECRET_KEY)
