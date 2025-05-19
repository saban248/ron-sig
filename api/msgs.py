from enum import Enum

from typing import Union


class ServerMsg(Enum):

    access_denied           = "access denied", 1
    complete                = "process completed successfully", 2

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
    msg_json = {"success":None, "title":None, "notice":None}

    @staticmethod
    def error(error_content:Union[str, int,ServerMsg]):
        msg = dict(SJson.msg_json)
        msg["success"] = False
        msg["title"] = "Error caused"
        SJson.__set_notice(msg, error_content)
        return msg

    @staticmethod
    def success(success_content:Union[str, int, ServerMsg]):
        msg = dict(SJson.msg_json)
        msg["success"] = True
        msg["title"] = "Done successfully"
        SJson.__set_notice(msg, success_content)
        return msg

    @staticmethod
    def __set_notice(msg:dict, notice:Union[str, int,ServerMsg]):
        if isinstance(notice, str):
            msg["notice"] = notice
        elif isinstance(notice, int):
            msg["notice"] = ServerMsg.get(notice).msg
        else:
            msg["notice"] = notice.msg



print(SJson.success(22))
