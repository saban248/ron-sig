import secrets

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
    def add_contract(client_id:str):
        contract = Contracts()

        contract.contract_id = secrets.token_hex(16)
        contract.client_id = client_id

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
