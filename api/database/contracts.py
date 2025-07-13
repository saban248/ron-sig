import secrets
from time import time

from flask_sqlalchemy.query import Query

from api.ptc import ron_db


class Contracts(ron_db.Model):
    xid = ron_db.Column(ron_db.Integer, nullable=False, primary_key=True)
    contract_id = ron_db.Column(ron_db.String(32), nullable=False)
    client_id = ron_db.Column(ron_db.String(32), nullable=False)
    client_signature = ron_db.Column(ron_db.LargeBinary, nullable=True)
    owner_signature = ron_db.Column(ron_db.LargeBinary, nullable=True)
    time_signed = ron_db.Column(ron_db.Float, nullable=True)




class ApiContract:

    @staticmethod
    def add_contract(client_id:str, owner_signature:bytes):
        contract = Contracts()

        contract.contract_id = secrets.token_hex(16)
        contract.client_id = client_id
        contract.owner_signature = owner_signature

        ron_db.session.add(contract)
        ron_db.session.commit()
        return contract.contract_id

    @staticmethod
    def get_contracts(source:bool = False, **kwargs):
        __column__ = Contracts.query.filter_by(**kwargs)
        if source:
            return __column__

        contracts = []
        for contract in __column__:
            __data__ = contract.__dict__
            del __data__["_sa_instance_state"]
            contracts.append(contract.__dict__)

        return contracts

    @staticmethod
    def get_contract(source:bool = True, **kwargs) -> Contracts:
        contract = Contracts.query.filter_by(**kwargs).first()
        if source:
            return contract
        __data__ = contract.__dict__
        del __data__["_sa_instance_state"]
        return  __data__

    @staticmethod
    def do_sign_client(ctid:str, signature:bytes):
        contract = ApiContract.get_contract(contract_id=ctid)
        if not contract:return False

        contract.client_signature = signature
        contract.time_signed = time()
        ron_db.session.commit()
        return True