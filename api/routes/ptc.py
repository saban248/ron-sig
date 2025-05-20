import binascii
import os
from enum import Enum

from flask.sessions import SessionMixin



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


class RouteApi(RoutePagesBase):

    auth = ["POST"], 1


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
    def valid_nonce(session:SessionMixin, breq:dict):
        return session.get("nonce", str(None)) == breq.get("nonce")
