import binascii
import os

from flask import session, request, jsonify, render_template, redirect, url_for

from api.database.equipments import ApiEquipment
from api.database.rents import ApiRentEquipment
from api.database.users import ApiClient
from api.general import get_dictionary_http, Pages
from api.msgs import SJson, ServerMsg
from api.ptc import ron_app
from api.routes.ptc import RoutePages, ShortSession



@ron_app.route("/", methods=["GET"])
@ron_app.route("/home", )
def main():
    if not ShortSession.is_admin(session):
        return redirect(url_for("login"))
    #[ApiRentEquipment.remove_rent(cid.rid) for cid in ApiRentEquipment.get_rents(True)]
    return render_template(Pages.home.val,
                           clients=ApiClient.get_clients(),
                           equipments=ApiEquipment.get_equipments(),
                           rents=ApiRentEquipment.build_rents())


@ron_app.route(RoutePages.login.path, methods=RoutePages.login.methods)
def login():
    if ShortSession.is_admin(session):
        return redirect(url_for("main"))

    nonce = ShortSession.set_nonce(session)
    return render_template(Pages.login.val, nonce=nonce)


@ron_app.route(RoutePages.contract.path, methods=RoutePages.contract.methods)
def contract():

    return render_template(Pages.contract.val)
