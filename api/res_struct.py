from dataclasses import dataclass


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


