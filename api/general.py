import os.path
import time
from copy import deepcopy
from datetime import datetime
from enum import Enum
from json import loads

from flask import Request
from numpy.ma.core import filled

from api.ptc import ServerConfig

CONTENT_TYPE_DATA = "multipart/form-data"
CONTENT_TYPE_FORM = "application/x-www-form-urlencoded"
CONTENT_TYPE_JSON = "application/json"
CONTENT_TYPE_ARGS = "a"

def get_dictionary_http(req:Request, content_type:str = str()) -> dict:
    _ctype = req.content_type or str()
    if CONTENT_TYPE_FORM in _ctype or CONTENT_TYPE_DATA in _ctype:
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



def save_image_equipment(request:Request):
    file = request.files.get('file')
    if not file or file.filename == '':return ServerConfig.DEFAULT_IMAGE
    fullpath = os.path.join(ServerConfig.PATH_UPLOAD, file.filename)
    file.save(fullpath)
    if verify_is_image(fullpath) != 0:
        os.remove(fullpath)
        return ""

    return os.path.basename(fullpath)


def get_safe_time_by_picker(_time:str) -> float:
    try:
        return datetime.strptime(_time, "%Y.%m.%d %H:%M").timestamp()
    except Exception as error:
        pass

    return 0.0


def loads_equipments_safe(equips:str):
    try:
        return loads(equips)
    except (OSError, Exception) as error:
        pass

    return {}