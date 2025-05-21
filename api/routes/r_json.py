from time import sleep

from flask import request, session

from api.database.users import ApiManager, ApiClient
from api.general import get_dictionary_http
from api.msgs import ServerMsg, SJson
from api.ptc import ron_app
from api.res_struct import ResAuth, ResAddClient
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


@ron_app.route(RouteApi.add_client.path, methods=RouteApi.add_client.methods)
def add_client():
    breq = get_dictionary_http(request)
    res = ResAddClient()
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)
    if not res.build(breq):
        return SJson.error(ServerMsg.add_client_failed)

    if ApiClient.exist(res.phone, res.identify):
        return SJson.error(ServerMsg.user_exist)

    ApiClient.add_client(res.phone, res.name, res.email, res.address, res.identify)
    return SJson.success(ServerMsg.complete)