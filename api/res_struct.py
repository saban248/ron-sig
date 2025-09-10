import json
from dataclasses import dataclass
from typing import Union

from api.database.equipments import ApiEquipment
from api.general import get_safe_time_by_picker, loads_equipments_safe, is_int
from api.msgs import ServerMsg


def is_html_entities(_str:str)-> bool:
    return "<" in _str or ">" in _str or "</" in _str


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

    def build(self, breq:dict) -> ServerMsg:
        self.name:str = breq.get("name")
        self.phone = breq.get("phone")
        self.identify = breq.get("cid")
        self.address = breq.get("address", "Unknown")
        self.email = breq.get("email", "unknown@gmail.com")
        if not self.name or not self.name.split(" ").__len__() >= 2:
            return ServerMsg.invalid_name_client
        elif not self.phone.__len__() >= 10 and self.phone.isdigit():
            return ServerMsg.invalid_phone
        elif not self.identify.__len__() == 9 or not self.identify.isdigit():
            return ServerMsg.invalid_identify

        return ServerMsg.complete


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
    count:Union[str, int]           = None
    crowd:Union[str, int]           = None
    company:str         = None
    eid:str             = None

    def build(self, breq:dict) -> ServerMsg:
        if not breq:return ServerMsg.input_invalid
        data:dict = json.loads(breq.get("params", "{}"))
        if not data:
            return ServerMsg.input_invalid

        for key, value in data.items(): self.__setattr__(key, value)
        if not self.name or not self.name.__len__() > 3:
            return ServerMsg.invalid_name_equipment
        elif not self.equip_type or not self.equip_type.__len__() > 3:
            return ServerMsg.invalid_equip_type
        elif not is_int(self.count):
            self.count = 0
        elif not is_int(self.crowd):
            self.crowd = 0
        elif not self.company:
            return ServerMsg.invalid_equip_company

        return ServerMsg.complete


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
    amount:Union[str, int, float]      = None
    pre_amount:Union[str, int, float] = None
    cid:str                     = None
    rid:str                 = None

    def build(self, breq:dict) -> ServerMsg:
        if not breq:return ServerMsg.input_invalid
        [self.__setattr__(key, value) for key, value in breq.items()]
        self.amount = breq.get("amount", 0)
        self.pre_amount = breq.get("pre_amount", 0) or 0
        if not self.address:
            return ServerMsg.invalid_address
        start = get_safe_time_by_picker(self.stime)
        end = get_safe_time_by_picker(self.etime)
        equips = loads_equipments_safe(self.equipments)
        if not start:
            return ServerMsg.invalid_stime
        elif not self.cid:
            return ServerMsg.invalid_cid_param
        elif not end:
            return ServerMsg.invalid_etime
        elif not self.stime < self.etime:
            return ServerMsg.invalid_stime
        elif not self.equipments or not equips:
            return ServerMsg.invalid_equipments
        elif not is_int(self.amount) or is_int(self.amount) and not int(self.amount):
            return ServerMsg.invalid_amount
        elif not is_int(self.pre_amount):
            return ServerMsg.invalid_pre_amount

        self.equipments = ApiEquipment.build_equipments_selected(equips)
        self.amount = float(self.amount)
        self.pre_amount = float(self.pre_amount)

        return ServerMsg.complete


@dataclass
class  ResContract:
    signature:str           = None
    ctid:str                = None
    cid:str                 = None
    rid:str                 = None
    def build(self, breq:dict):
        [self.__setattr__(key, value) for key, value in breq.items()]
        if not self.ctid or not self.cid or not self.rid:return ServerMsg.input_invalid

        return ServerMsg.complete

@dataclass
class ResContractUser(ResContract):

    def build(self, breq:dict):
        status = super().build(breq)
        if status != ServerMsg.complete:
            return status
        signature = breq.get("signature", "")
        if not signature or len(signature) < 500:
            return ServerMsg.input_invalid

        return status


@dataclass
class ResSettings:
    signature:str               = None
    action_id:int               = None

    def build(self, breq:dict) -> ServerMsg:
        action_id:str|int = str(breq.get("action", -1))
        if action_id == -1 or not action_id.isdigit():
            return ServerMsg.input_invalid
        self.action_id = int(action_id)
        [self.__setattr__(key, value) for key, value in breq.items()]

        return  ServerMsg.complete


@dataclass
class ResActionRent:
    rid:str                 = None
    status:int              = None
    def build(self, breq:dict):
        [setattr(self, k, v) for k, v in breq.items()]
        self.status = -1 if not is_int(self.status) else self.status
        if self.status == -1:
            return ServerMsg.input_invalid
        if not self.rid:
            return ServerMsg.input_invalid

        return ServerMsg.complete

@dataclass
class ResHomeRents:

    status: int = None

    def build(self, breq: dict):
        status = breq.get("status", -1)
        if status == -1 or not is_int(status):
            return ServerMsg.invalid_status_rent

        self.status = int(status)
        return ServerMsg.complete


@dataclass
class ResUpdateManagerSettings:
    fullname:str        = None
    identify:str        = None
    he_name:str         = None
    email:str           = None
    phone:str           = None
    mid:str             = None
    company_name:str    = None

    def build(self, breq:dict, mid:str =None):
        [setattr(self, k, v) for k,v in breq.items()]
        if not self.mid:
            if not mid:return False
            self.mid = mid
        if self.fullname:
            if not self.fullname.split(" ").__len__() > 1:return False
        if self.identify:
            if not self.identify.__len__() == 9 or not self.identify.isdigit():return False
        if self.he_name:
            if not self.he_name.split(" ").__len__() > 1:return False
        if self.email:
            if "@" not in self.email or "." not in self.email:return False
        if self.phone:
            pass
        if is_html_entities(self.company_name or "str"):
            return False

        return True
