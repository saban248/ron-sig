from flask import session, request, jsonify

from api.general import get_dictionary_http
from api.msgs import SJson, ServerMsg
from api.ptc import ron_app
from api.routes.ptc import RoutePages, ShortSession


@ron_app.route(RoutePages.login.path, methods=RoutePages.login.methods)
def login():
    if ShortSession.is_admin(session):
        return jsonify(SJson.error(ServerMsg.access_denied))

    return "page"