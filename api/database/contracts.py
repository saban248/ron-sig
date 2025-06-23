from api.ptc import ron_db


class Contracts(ron_db.Model):
    xid = ron_db.Column(ron_db.Integer, nullable=False, primary_key=True)
    contract_id = ron_db.Column(ron_db.String(32), nullable=False)
    client_id = ron_db.Column(ron_db.String(32), nullable=False)
    client_signature = ron_db.Column(ron_db.LargeBinary, nullable=False)
    owner_signature = ron_db.Column(ron_db.LargeBinary, nullable=False)
    time_signed = ron_db.Column(ron_db.Flaot, nullable=False)

