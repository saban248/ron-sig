from api.ptc import ron_db


class Equipment(ron_db.Model):
    __tablename__ = "Equipments"
    eid = ron_db.Column(ron_db.Integer, primary_key=True)
    name = ron_db.Column(ron_db.String, nullable=False)
    etype = ron_db.Column(ron_db.String, nullable=False)
    count_people = ron_db.Column(ron_db.Integer, nullable=False)
    company = ron_db.Column(ron_db.String, nullable=False)
    img = ron_db.Column(ron_db.String, nullable=False)
