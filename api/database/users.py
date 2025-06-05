import secrets

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



class Client(ron_db.Model):
    __tablename__ = "Client"
    xid = ron_db.Column(ron_db.Integer, primary_key=True)
    cid = ron_db.Column(ron_db.String, nullable=False)
    phone = ron_db.Column(ron_db.String, nullable=False)
    fullname = ron_db.Column(ron_db.String, nullable=False)
    identify = ron_db.Column(ron_db.String, nullable=False)
    address = ron_db.Column(ron_db.String, nullable=True)
    email = ron_db.Column(ron_db.String, nullable=True)


class ApiClient:

    @staticmethod
    def add_client(phone:str, fullname:str, email:str, address:str, identify:str, ) -> bool:
        if ApiClient.exist(phone, identify):return False

        client = Client()
        client.cid = secrets.token_hex(16)
        client.phone = phone
        client.fullname = fullname
        client.email = email
        client.address = address
        client.identify = identify
        ron_db.session.add(client)
        ron_db.session.commit()
        return True

    @staticmethod
    def remove_client(phone:str, cid:str):
        client = ApiClient.exist(phone, cid=cid)
        if not client:return False

        ron_db.session.delete(client)
        ron_db.session.commit()
        return True

    @staticmethod
    def exist(phone:str, identify:str, **kwargs):
        return Client.query.filter_by(phone=phone, **kwargs).first()

    @staticmethod
    def delete_client(cid:str) -> bool:
        clients = ApiClient.get_clients(True, cid=cid)
        if not clients:return False
        ron_db.session.delete(clients[0])
        ron_db.session.commit()
        return True

    @staticmethod
    def get_clients(source:bool = False, **kwargs):
        _client = []
        for client in Client.query.filter_by(**kwargs):
            if not source:
                __data__ = client.__dict__
                del __data__["_sa_instance_state"]
                _client.append(client.__dict__)
                continue
            _client.append(client)

        return _client

