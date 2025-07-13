import json
import secrets
from dataclasses import dataclass
from typing import Union

from flask_sqlalchemy.query import Query

from api.database.contracts import ApiContract
from api.database.ptc import RentEquipmentStatus
from api.database.users import ApiClient
from api.general import RentEventData
from api.ptc import ron_db




class RentEquipment(ron_db.Model):
    __tablename__ = "RentEquipment"

    xid = ron_db.Column(ron_db.Integer, nullable=False, primary_key=True)
    rid = ron_db.Column(ron_db.String(32), nullable=False)
    address = ron_db.Column(ron_db.String, nullable=False)
    start_rent = ron_db.Column(ron_db.String, nullable=False)
    end_rent = ron_db.Column(ron_db.String, nullable=False)
    equipments = ron_db.Column(ron_db.String, nullable=False)
    cid = ron_db.Column(ron_db.String, nullable=False)
    status = ron_db.Column(ron_db.Integer, nullable=False, default=0)
    amount = ron_db.Column(ron_db.Float, nullable=False)
    pre_amount = ron_db.Column(ron_db.Float, nullable=False)
    contract_id = ron_db.Column(ron_db.String(32), nullable=False)



class ApiRentEquipment:

    @staticmethod
    def add_rent(address:str, s_rent:str, e_rent:str, equipments:dict, cid:str, amount:float, pre_amount:float, contract_id:str):
        rent = RentEquipment()
        rent.rid = secrets.token_hex(16)
        rent.address = address
        rent.start_rent = s_rent
        rent.end_rent = e_rent
        rent.equipments = json.dumps(equipments)
        rent.cid = cid
        rent.amount = amount
        rent.pre_amount = pre_amount
        rent.contract_id = contract_id
        rent.status = RentEquipmentStatus.LIVE.code
        ron_db.session.add(rent)
        ron_db.session.commit()
        return True

    @staticmethod
    def remove_rent(rid:str):
        rent = ApiRentEquipment.get_rents(True, rid=rid).first()
        if not rent:return False

        ron_db.session.delete(rent)
        ron_db.session.commit()
        return True

    @staticmethod
    def get_rents(source: bool = False, **kwargs) -> Union[list[dict], Query]:
        __columns__ = RentEquipment.query.filter_by(**kwargs)
        if source:
            return __columns__

        rents = []
        for rent in __columns__:
            __data__ = rent.__dict__
            del __data__["_sa_instance_state"]
            rents.append(rent.__dict__)

        return rents

    @staticmethod
    def set_flag(cid:str, flag:RentEquipmentStatus):
        rent:RentEquipment = ApiRentEquipment.get_rents(True, rid=cid).first()
        if not rent:return False
        rent.status = flag.code

        ron_db.session.commit()
        return True

    @staticmethod
    def build_rents(status:int = RentEquipmentStatus.LIVE.code) -> list[RentEventData]:
        data = []
        for rent in ApiRentEquipment.get_rents(True, status=status):
            __rent__ = rent.__dict__
            del __rent__["_sa_instance_state"]
            __rent__["equipments"] = json.loads(__rent__["equipments"])
            client = ApiClient.get_clients(cid=rent.cid)
            if not client: continue
            contract = ApiContract.get_contracts(client_id=rent.cid, contract_id=rent.contract_id)
            if not contract: continue
            data.append(RentEventData(rent=__rent__, client=client[0], contract=contract[0]))
        return data





