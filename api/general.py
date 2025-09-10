import os.path
import time
from copy import deepcopy
from dataclasses import dataclass
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
from PIL import Image


def is_int(some):
    try:
        int(some)
    except (ValueError, TypeError):
        return False
    return True


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
    contract = "contract.html"
    success = "success.html"
    error = "error.html"

    @property
    def val(self):
        return super().value



def verify_is_image(filepath) -> int:
    try:
        with Image.open(filepath) as img:
            img.verify()
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


@dataclass
class RentEventData:
    rent: dict          = None
    client:dict         = None
    contract:dict       = None





def short_time_until(event_ts: float) -> str:
    delta = event_ts - datetime.now().timestamp()
    if delta <= 0:
        return "0D 00H 00MIN"

    days = int(delta // 86400)
    hours = int((delta % 86400) // 3600)
    minutes = int((delta % 3600) // 60)

    return f"{days}d {hours:02d}h {minutes:02d}m"





