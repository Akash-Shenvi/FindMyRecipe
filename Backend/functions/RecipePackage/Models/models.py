from flask_sqlalchemy import SQLAlchemy
from sqlalchemy.dialects.mysql import LONGBLOB
db = SQLAlchemy()

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    name= db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(15), unique=True, nullable=True)
    age = db.Column(db.Integer)
    bio = db.Column(db.String(500))
    image = db.Column(LONGBLOB)

    # def __repr__(self):
        # return f"<User {self.email}>"

class UploadedRecipe(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    ingredients = db.Column(db.Text, nullable=False)
    instructions = db.Column(db.Text, nullable=False)
    image_url = db.Column(db.String(500))
    cuisine = db.Column(db.String(100))      # ✅ New
    course = db.Column(db.String(100))       # ✅ New
    diet = db.Column(db.String(100))         # ✅ New
    prep_time = db.Column(db.String(50))     # ✅ New

    def __init__(self, title, ingredients, instructions, image_url=None, cuisine='', course='', diet='', prep_time=''):
        self.title = title
        self.ingredients = ingredients
        self.instructions = instructions
        self.image_url = image_url
        self.cuisine = cuisine
        self.course = course
        self.diet = diet
        self.prep_time = prep_time

class Aisavedrecipe(db.Model):
    recipe_id=db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    recipe_name = db.Column(db.String(255), nullable=False)
    recipe=db.Column(db.JSON, nullable=False)
    