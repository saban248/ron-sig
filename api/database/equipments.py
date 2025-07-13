import os
import secrets

from typing import Union

from api.ptc import ron_db, ServerConfig


class Equipment(ron_db.Model):
    __tablename__ = "Equipments"
    xid = ron_db.Column(ron_db.Integer, primary_key=True)
    eid = ron_db.Column(ron_db.String, nullable=False)
    name = ron_db.Column(ron_db.String, nullable=False)
    etype = ron_db.Column(ron_db.String, nullable=False)
    count =  ron_db.Column(ron_db.Integer, nullable=False)
    count_people = ron_db.Column(ron_db.Integer, nullable=False)
    company = ron_db.Column(ron_db.String, nullable=False)
    img_name = ron_db.Column(ron_db.String, nullable=False)


class ApiEquipment:

    @staticmethod
    def add_equipment(name:str, equip_type:str, count_equip:int, count_people:int, company:str, filename:str, eid:str = None) -> bool:
        if not eid:
            equip = Equipment()
        else:
            equip = ApiEquipment.get_equipments(True, eid=eid)
            if not equip:return False
            equip = equip[0]
        equip.name = name
        equip.etype = equip_type
        equip.count = count_equip
        equip.count_people = count_people
        equip.company = company
        if eid and filename == ServerConfig.DEFAULT_IMAGE:
            pass
        else:
            equip.img_name = filename
        equip.eid = secrets.token_hex(16)
        not eid and ron_db.session.add(equip)
        ron_db.session.commit()

        return True

    @staticmethod
    def exist(**kwargs) -> Union[bool, Equipment]:
        equip = ApiEquipment.get_equipments(True,**kwargs)
        if not equip:return False

        return equip[0]

    @staticmethod
    def remove_equipment(eid:str):
        equip =  ApiEquipment.exist(eid=eid)
        if not equip:return False

        # remove img
        if equip.img_name != ServerConfig.DEFAULT_IMAGE:
            try:
                os.remove(os.path.join(ServerConfig.PATH_UPLOAD, equip.img_name))
            except OSError:
                pass

        ron_db.session.delete(equip)
        ron_db.session.commit()
        return True

    @staticmethod
    def get_equipments(source:bool = False, **kwargs) -> Union[list[Equipment], list[dict]]:
        equips = []
        for equipment in Equipment.query.filter_by(**kwargs):
            if not source:
                __data__ = equipment.__dict__
                del __data__["_sa_instance_state"]
                equips.append(equipment.__dict__)
                continue
            equips.append(equipment)

        return equips

    @staticmethod
    def build_equipments_selected(equipments:dict):
        equips = []
        for e in equipments:
            equip = ApiEquipment.get_equipments(eid=e["eid"])
            if not equip:continue
            equip[0]["selected"] = e['count']
            equips.append(equip)
        return equips




