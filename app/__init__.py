from flask import Flask
from flask_restful import Api, Resource, reqparse
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

app = Flask(__name__, template_folder="templates", static_folder="static")
app.secret_key = "secret_key"
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///db.sqlite3"

api = Api(app)
db = SQLAlchemy(app)
migrate = Migrate(app=app)
cors = CORS()
cors.init_app(app, origins="*")

from .urls import *
