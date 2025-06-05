from enum import Enum

from typing import Union


class ServerMsg(Enum):

    access_denied           = "access denied", 1
    complete                = "process completed successfully", 2
    login_failed            = "Login failed user/password", 3
    add_client_failed       = "Customer addition failed", 4
    user_exist              = "This user already exist", 5
    input_invalid            = "Input invalid", 6
    user_deleted            = "User deleted successfully", 7

    @property
    def code(self):
        return super().value[1]

    @property
    def msg(self):
        return " ".join(super().value[0].split("_")).capitalize()

    @staticmethod
    def get(code:int):
        for i in ServerMsg:
            if i.code == code:
                return i

        return ServerMsg.access_denied


class SJson:
    msg_json = {"success":None, "title":None, "notice":None, "code":0}

    @staticmethod
    def error(error_content:Union[str, int,ServerMsg], **errors):
        msg = dict(SJson.msg_json, **errors)
        msg["success"] = False
        msg["title"] = "Error caused"
        SJson.__set_notice(msg, error_content)
        return msg

    @staticmethod
    def success(success_content:Union[str, int, ServerMsg], **success):
        msg = dict(SJson.msg_json, **success)
        msg["success"] = True
        msg["title"] = "Done"
        SJson.__set_notice(msg, success_content)
        return msg

    @staticmethod
    def __set_notice(msg:dict, notice:Union[str, int,ServerMsg]):
        if isinstance(notice, str):
            msg["notice"] = notice
            msg["code"] = -1
        elif isinstance(notice, int):
            msg["notice"] = ServerMsg.get(notice).msg
            msg["code"] = notice
        else:
            msg["notice"] = notice.msg
            msg["code"] = notice.code


