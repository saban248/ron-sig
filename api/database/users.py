from api.ptc import ron_db


class Manager(ron_db.Model):
    __tablename__ = "Manager"
    mid = ron_db.Column(ron_db.Integer, primary_key=True)
    fullname = ron_db.Column(ron_db.String, nullable=False)
    name = ron_db.Column(ron_db.String, nullable=False)
    he_name = ron_db.Column(ron_db.String, nullable=False)
    password = ron_db.Column(ron_db.String, nullable=False)
    phone = ron_db.Column(ron_db.String, nullable=False)
    email = ron_db.Column(ron_db.String, nullable=False)
    identify = ron_db.Column(ron_db.String, nullable=False)
    ip = ron_db.Column(ron_db.String, nullable=False)
    address = ron_db.Column(ron_db.String, nullable=False)
    company_name = ron_db.Column(ron_db.String, nullable=False)


class ApiManager:

    @staticmethod
    def add_manager(name:str, fullname:str, password:str, phone:str, email:str, ip:str, address:str, identify:str, comp_name:str,
                    hebrew_name:str):
        if ApiManager.login(name, password):raise OSError("user exist")
        manager = Manager()
        manager.fullname = fullname
        manager.name = name
        manager.phone = phone
        manager.password = password
        manager.email = email
        manager.identify = identify
        manager.company_name = comp_name
        manager.ip = ip
        manager.he_name = hebrew_name
        manager.address = address
        ron_db.session.add(manager)
        ron_db.session.commit()

    @staticmethod
    def remove_manager(mid:int):
        manager = Manager.query.filter_by(mid=mid).first()
        if not manager:return

        ron_db.session.deleted(manager)
        ron_db.session.commit()

    @staticmethod
    def login(name, password):
        return Manager.query.filter_by(name=name, password=password).first()

