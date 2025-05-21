import binascii
import os
from datetime import timedelta
from enum import Enum
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


class ServerConfig(Enum):
    FILE_NAME_DB        = "roni"

ron_app = Flask("ronapp", template_folder=os.path.join("client", "pages"),
                static_folder=os.path.join("client", "static"))

ron_app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{ServerConfig.FILE_NAME_DB.value}.db"
ron_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # // default
ron_app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
ron_app.secret_key = binascii.hexlify(os.urandom(8)).decode()
ron_db = SQLAlchemy(ron_app)
migrate = Migrate(ron_app, ron_db)
