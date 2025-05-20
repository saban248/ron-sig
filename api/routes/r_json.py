from flask import request, session

from api.database.users import ApiManager
from api.general import get_dictionary_http
from api.msgs import ServerMsg, SJson
from api.ptc import ron_app
from api.res_struct import ResAuth
from api.routes.ptc import RouteApi, ShortSession


@ron_app.route(RouteApi.auth.path, methods=RouteApi.auth.methods)
def auth():
    breq = get_dictionary_http(request)

    res = ResAuth()
    if not res.build(breq):
        return SJson.error(ServerMsg.access_denied)
    if not ApiManager.login(res.user, res.password):
        return SJson.error(ServerMsg.login_failed)
    elif not ShortSession.valid_nonce(session, breq):
        return SJson.error("תטעין את העמוד מחדש")

    session["is_admin"] = True
    return SJson.success(ServerMsg.complete)
