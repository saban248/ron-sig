import binascii
import os
from datetime import timedelta
from enum import Enum

from flask import Flask
from flask_sqlalchemy import SQLAlchemy


class ServerConfig(Enum):
    FILE_NAME_DB        = "roni"

ron_app = Flask("main", template_folder="tmp")
ron_app.config['SQLALCHEMY_DATABASE_URI'] = f"sqlite:///{ServerConfig.FILE_NAME_DB}.db"
ron_app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False  # // default
ron_app.config['PERMANENT_SESSION_LIFETIME'] = timedelta(days=30)
ron_app.secret_key = binascii.hexlify(os.urandom(8)).decode()
ron_db = SQLAlchemy(ron_app)
