from time import sleep

from flask import request, session

from api.database.contracts import ApiContract
from api.database.equipments import ApiEquipment
from api.database.rents import ApiRentEquipment
from api.database.users import ApiManager, ApiClient
from api.general import get_dictionary_http, save_image_equipment
from api.msgs import ServerMsg, SJson
from api.ptc import ron_app, ron_db
from api.res_struct import ReqAuth, ReqAddClient, ResListClients, ResDeleteClient, ResAddEquipment, ResEquip, \
    ResNewRent, ResSettings, ResContractUser
from api.routes.ptc import RouteApi, ShortSession, SettingsApi


@ron_app.route(RouteApi.auth.path, methods=RouteApi.auth.methods)
def auth():
    breq = get_dictionary_http(request)

    res = ReqAuth()
    if not res.build(breq):
        return SJson.error(ServerMsg.access_denied)
    if not ApiManager.login(res.user, res.password):
        return SJson.error(ServerMsg.login_failed)
    elif not ShortSession.valid_nonce(session, breq):
        return SJson.error("תטעין את העמוד מחדש")

    ShortSession.set_admin(session)
    manager = ApiManager.get_manager(name=res.user, password=res.password)
    manager['signature'] = ''
    ShortSession.set_admin_details(session, manager)
    return SJson.success(ServerMsg.complete)


@ron_app.route(RouteApi.add_client.path, methods=RouteApi.add_client.methods)
def add_client():
    breq = get_dictionary_http(request)
    res = ReqAddClient()
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)
    if not res.build(breq):
        return SJson.error(ServerMsg.add_client_failed)

    if ApiClient.exist(res.phone, res.identify):
        return SJson.error(ServerMsg.user_exist)

    ApiClient.add_client(res.phone, res.name, res.email, res.address, res.identify)
    return SJson.success(ServerMsg.complete)

@ron_app.route(RouteApi.list_clients.path, methods=RouteApi.list_clients.methods)
def list_clients():
    breq = get_dictionary_http(request)
    res = ResListClients()
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)

    return SJson.success(ServerMsg.complete, clients=ApiClient.get_clients())

@ron_app.route(RouteApi.delete_client.path, methods=RouteApi.delete_client.methods)
def delete_client():
    breq = get_dictionary_http(request)
    res = ResDeleteClient()
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)

    if not res.build(breq):
        return SJson.error(ServerMsg.input_invalid)

    deleted = ApiClient.delete_client(res.client_id)
    if not deleted:
        return SJson.success(ServerMsg.input_invalid)

    return SJson.success(ServerMsg.user_deleted)


@ron_app.route(RouteApi.add_equip.path, methods=RouteApi.add_equip.methods)
def add_equipment():
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)

    breq = get_dictionary_http(request)
    res = ResAddEquipment()
    if not res.build(breq):
        return SJson.error(ServerMsg.add_equip_failed)

    filename = save_image_equipment(request)
    if not filename:
        return SJson.error(ServerMsg.upload_failed)
    completed = ApiEquipment.add_equipment(res.name, res.equip_type, int(res.count),
                                           int(res.crowd),res.company, filename, eid=res.eid)
    return SJson.success(ServerMsg.complete)


@ron_app.route(RouteApi.delete_equip.path, methods=RouteApi.delete_equip.methods)
def delete_equip():
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)

    breq = get_dictionary_http(request)
    res = ResEquip()
    if not res.build(breq):
        return SJson.error(ServerMsg.input_invalid)

    deleted = ApiEquipment.remove_equipment(res.eid)
    if not deleted:
        return SJson.error(ServerMsg.operation_failed)

    return SJson.success(ServerMsg.complete)


@ron_app.route(RouteApi.get_equip.path, methods=RouteApi.get_equip.methods)
def get_equipment():
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)

    breq = get_dictionary_http(request)
    res = ResEquip()
    if not res.build(breq):
        return SJson.error(ServerMsg.input_invalid)
    if res.eid:
        equip = ApiEquipment.get_equipments(False, eid=res.eid)
    else:
        equip = ApiEquipment.get_equipments(False)
    if not equip:
        return SJson.error(ServerMsg.operation_failed)

    return SJson.success(ServerMsg.complete, **{"equipment":equip})


@ron_app.route(RouteApi.add_rent.path, methods=RouteApi.add_rent.methods)
def add_rent():
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)

    breq = get_dictionary_http(request)
    res = ResNewRent()
    status = res.build(breq)
    if status != ServerMsg.complete:
        return SJson.error(status)

    manager = ApiManager.get_manager(True, mid=ShortSession.get_admin_details(session)["mid"])
    contract_id = ApiContract.add_contract(res.cid, manager.signature)
    ApiRentEquipment.add_rent(res.address, res.stime, res.etime,res.equipments, res.cid,res.amount,
                              res.pre_amount, contract_id)

    return SJson.success(status)


@ron_app.route(RouteApi.settings.path, methods=RouteApi.settings.methods)
def settings():
    e_invalid = SJson.error(ServerMsg.input_invalid)
    if not ShortSession.is_admin(session):
        return SJson.error(ServerMsg.access_denied)

    breq = get_dictionary_http(request)
    res = ResSettings()
    if not res.build(breq):
        return e_invalid

    if res.action_id is SettingsApi.update_signature.code:
        manager = ApiManager.get_manager(True, mid=ShortSession.get_admin_details(session).get("mid"))
        if not manager:return e_invalid
        manager.signature = res.signature.encode()
        ron_db.session.commit()


    return SJson.success(ServerMsg.complete)


@ron_app.route(RouteApi.do_contract.path, methods=RouteApi.do_contract.methods)
def do_contract():

    breq = get_dictionary_http(request)
    res = ResContractUser()
    status = res.build(breq)
    if status != ServerMsg.complete:
        return SJson.error(status)
    status = ApiContract.do_sign_client(res.ctid, res.signature.encode())
    if not status:return SJson.error(ServerMsg.input_invalid)

    return SJson.success(status)
