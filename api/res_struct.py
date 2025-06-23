import json
import time
from dataclasses import dataclass
from datetime import datetime
from typing import Union

from api.general import get_safe_time_by_picker, loads_equipments_safe
from api.msgs import ServerMsg


@dataclass
class ReqAuth:
    user:str        = None
    password:str    = None
    nonce:str       = None

    def build(self, breq:dict) -> bool:
        user = breq.get("user")
        pwd = breq.get("password")
        if not user:
            return False
        elif not pwd:
            return False

        self.user = user
        self.password = pwd
        return True


@dataclass
class ReqAddClient:

    name:str        = None
    phone:str       = None
    identify:str    = None
    address:str     = None
    email:str       = None

    def build(self, breq:dict) -> bool:
        self.name:str = breq.get("name")
        self.phone = breq.get("phone")
        self.identify = breq.get("cid")
        self.address = breq.get("address", "Unknown")
        self.email = breq.get("email")
        if not all((self.name, self.phone, self.identify)):
            return False
        elif not self.name.split(" ").__len__() >= 2:
            return False
        elif not self.phone.__len__() >= 10 and self.phone.isdigit():
            return False
        elif not self.identify.__len__() == 9 and self.identify.isdigit():
            return False


        return True


@dataclass
class ResListClients:

    clients:list        = None

@dataclass
class ResDeleteClient:
    client_id:str       = None

    def build(self, breq:dict):
        cid = breq.get("cid", str())
        if cid.__len__()!=32:return False
        self.client_id = cid
        return True



@dataclass
class ResAddEquipment:
    name:str            = None
    equip_type:str      = None
    count:str           = None
    crowd:str           = None
    company:str         = None
    eid:str             = None

    def build(self, breq:dict) -> bool:
        if not breq:return False
        data:dict = json.loads(breq.get("params", "{}"))
        if not data or data.get("file"):return False
        for key, value in data.items():self.__setattr__(key, value)

        return all(self.__dict__.keys()) and self.crowd.isdigit() and self.count.isdigit()


@dataclass
class ResEquip:
    eid:str             = None

    def build(self, breq:dict):
        equip_id =  breq.get("eid", "")
        if  equip_id and equip_id.__len__() != 32:return False
        self.eid = equip_id

        return True


@dataclass
class ResNewRent:
    address:str                 = None
    stime:str                   = None
    etime:str                   = None
    equipments:Union[dict, str] = None
    amount:Union[str, int]      = None
    cid:str                     = None

    def build(self, breq:dict) -> ServerMsg:
        if not breq:return ServerMsg.input_invalid
        [self.__setattr__(key, value) for key, value in breq.items()]
        if not self.address:return ServerMsg.input_invalid

        start = get_safe_time_by_picker(self.stime)
        end = get_safe_time_by_picker(self.etime)
        equips = loads_equipments_safe(self.equipments)
        if not self.cid:return ServerMsg.input_invalid
        if not self.stime:return ServerMsg.invalid_stime
        if not self.etime or not start < end:return ServerMsg.invalid_etime
        if not self.equipments or not equips:return ServerMsg.invalid_equipments
        if not self.amount or not self.amount.isdigit():return ServerMsg.input_invalid
        self.amount = int(self.amount)
        return ServerMsg.complete

