from dataclasses import dataclass


@dataclass
class ResAuth:
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
