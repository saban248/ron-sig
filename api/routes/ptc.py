import binascii
import os
from dataclasses import dataclass
from enum import Enum

from flask.sessions import SessionMixin

from api.database.users import Manager
from api.msgs import ServerMsg


class RoutePagesBase(Enum):

    @property
    def code(self):
        return super().value[1]

    @property
    def methods(self):
        return super().value[0]

    @property
    def path(self):
        return f"/{super().name}"

class RoutePages(RoutePagesBase):

    login           = ["GET"],1
    contract        = ["GET", "POST"],2
    success         = ["GET"], 3


class RouteApi(RoutePagesBase):

    auth = ["POST"], 1
    add_client = ["POST"], 2
    list_clients = ["POST"], 3
    delete_client = ["POST"], 4
    add_equip = ["POST"], 5
    delete_equip = ["POST"], 6
    get_equip = ["POST"],7
    add_rent = ["POST"], 8
    settings = ["POST"], 9
    delete_rent = ["POST"], 10
    complete_rent = ["POST"], 11
    remove_rent = ["POST"], 12
    canceled_rent = ["POST"], 13
    do_contract = ["POST"], 14


class SettingsApi(Enum):

    update_signature = 1

    @property
    def code(self):
        return super().value


class ShortSession:

    @staticmethod
    def set_admin(session:SessionMixin):
        session["is_admin"] = True

    @staticmethod
    def is_admin(session:SessionMixin):
        return session.get("is_admin")

    @staticmethod
    def set_nonce(session:SessionMixin) -> str:
        nonce = binascii.b2a_hex(os.urandom(16)).decode()
        session["nonce"] = nonce

        return nonce
    @staticmethod
    def get_admin_details(session:SessionMixin) -> dict:
        return session.get("details", {})

    @staticmethod
    def set_admin_details(session:SessionMixin, data:dict):
        session['details'] = data
    @staticmethod
    def valid_nonce(session:SessionMixin, breq:dict):
        return session.get("nonce", str(None)) == breq.get("nonce")


