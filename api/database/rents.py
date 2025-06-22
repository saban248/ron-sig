import secrets

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
    amount = ron_db.Column(ron_db.Integer, nullable=False)



class ApiRentEquipment:

    @staticmethod
    def add_rent(address:str, s_rent:str, e_rent:str, equipments:str, cid:str, amount:int):
        rent = RentEquipment()
        rent.rid = secrets.token_hex(16)
        rent.address = address
        rent.start_rent = s_rent
        rent.end_rent = e_rent
        rent.equipments = equipments
        rent.cid = cid
        rent.amount = amount
        ron_db.session.add(rent)
        ron_db.session.commit()
        return True

    def remove_rent(self, rid:str):
        return 0

    @staticmethod
    def get_rents(source: bool = False, **kwargs):
        rents = []
        for rent in RentEquipment.query.filter_by(**kwargs):
            if not source:
                __data__ = rent.__dict__
                del __data__["_sa_instance_state"]
                rents.append(rent.__dict__)
                continue
            rents.append(rent)

        return rents