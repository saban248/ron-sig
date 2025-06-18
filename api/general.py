import os.path
from copy import deepcopy
from enum import Enum

from flask import Request


CONTENT_TYPE_FORM = "application/x-www-form-urlencoded"
CONTENT_TYPE_JSON = "application/json"
CONTENT_TYPE_ARGS = "a"

def get_dictionary_http(req:Request) -> dict:
    _ctype = req.content_type or str()
    if CONTENT_TYPE_FORM in _ctype:
        return deepcopy(req.form.to_dict())

    elif CONTENT_TYPE_JSON in _ctype:
        return deepcopy(req.json)

    elif req.method == 'GET':
        return deepcopy(req.args.to_dict())

    # else return empty dictionary
    return dict()


class Pages(Enum):
    login = "login.html"
    home = "home.html"

    @property
    def val(self):
        return super().value



def verify_is_image(filepath) -> int:
    try:
        with open(filepath, "rb") as f:
            data = f.read()

        data = data[120::]
        for i, b in enumerate(data):
            if not (0 <= b <= 255):
                return 8
    except Exception as e:
        return 8

    return 0

