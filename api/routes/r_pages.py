import binascii
import json
import os

from flask import session, request, jsonify, render_template, redirect, url_for, abort

from api.database.contracts import ApiContract, Contracts
from api.database.equipments import ApiEquipment
from api.database.ptc import RentEquipmentStatus
from api.database.rents import ApiRentEquipment, RentEquipment
from api.database.users import ApiClient, ApiManager
from api.general import get_dictionary_http, Pages
from api.msgs import SJson, ServerMsg
from api.ptc import ron_app
from api.res_struct import ResContract, ResHomeRents
from api.routes.ptc import RoutePages, ShortSession


@ron_app.route("/success", methods=RoutePages.success.methods)
def success():
    return render_template(Pages.success.val)

@ron_app.route("/error", methods=RoutePages.success.methods)
def error():
    return render_template(Pages.error.val)

@ron_app.route("/", methods=["GET"])
@ron_app.route("/home", )
def main():
    if not ShortSession.is_admin(session):
        return redirect(url_for("login"))
    #[ApiRentEquipment.remove_rent(cid.rid) for cid in ApiRentEquipment.get_rents(True)]
    breq = get_dictionary_http(request)
    print(breq)
    res = ResHomeRents()
    res.build(breq)
    if res.build(breq) != ServerMsg.complete:
        res.status = RentEquipmentStatus.LIVE.code
    print(ShortSession.get_admin_details(session))
    return render_template(Pages.home.val,
                           clients=ApiClient.get_clients(),
                           equipments=ApiEquipment.get_equipments(),
                           rents=ApiRentEquipment.build_rents(res.status),
                           settings=ShortSession.get_admin_details(session))


@ron_app.route(RoutePages.login.path, methods=RoutePages.login.methods)
def login():
    if ShortSession.is_admin(session):
        return redirect(url_for("main"))

    nonce = ShortSession.set_nonce(session)
    return render_template(Pages.login.val, nonce=nonce)




@ron_app.route(RoutePages.contract.path, methods=RoutePages.contract.methods)
def contract():
    rerror = lambda err=ServerMsg.access_denied:render_template(Pages.error.val, error=err.msg)
    breq = get_dictionary_http(request)
    if not breq:
        return rerror()
    res = ResContract()
    status = res.build(breq)
    if status  != ServerMsg.complete:
        return rerror(status)

    client = ApiClient.get_clients(True, cid=res.cid).first()
    rent:RentEquipment = ApiRentEquipment.get_rents(True, rid=res.rid).first()
    ct:Contracts = ApiContract.get_contracts(True, contract_id=res.ctid).first()
    manager = ApiManager.get_manager(True, signature=ct.owner_signature)
    if not client or not rent or not ct:return rerror(ServerMsg.input_invalid)
    return render_template(Pages.contract.val, client=client, rent=rent, contract=ct,
                           equipments=json.loads(rent.equipments), manager=manager)



