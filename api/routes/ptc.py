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




class ShortSession:

    @staticmethod
    def is_admin(session:SessionMixin):
        return session.get("is_admin")


