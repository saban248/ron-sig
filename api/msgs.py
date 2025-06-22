from enum import Enum

from typing import Union


class ServerMsg(Enum):

    access_denied           = "גישה נאסרה", 1
    complete                = "התהליך הושלם בהצלחה", 2
    login_failed            = "ההתחברות נכשלה", 3
    add_client_failed       = "הוספת הלקוח נכלשה", 4
    user_exist              = "הלקוח כבר קיים במערכת", 5
    input_invalid            = "Input invalid", 6
    user_deleted            = "הלקוח נמחק", 7
    add_equip_failed        = "הוספת הציוד נכשלה, בדוק את הפרטים שהזנת", 8
    upload_failed           = "העלאת הקובץ נכשלה, לא זוהתה תמונה!", 9
    operation_failed        = 'הפעולה נכשלה', 10
    invalid_stime           = "תאריך תחילת האירוע לא תקין", 11
    invalid_etime           = "תאריך סיום האירוע לא תקין", 12
    invalid_equipments      = "רשימת ציוד לא תקינה", 13

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
        msg["title"] = "התרחשה שגיאה"
        SJson.__set_notice(msg, error_content)
        return msg

    @staticmethod
    def success(success_content:Union[str, int, ServerMsg], **success):
        msg = dict(SJson.msg_json, **success)
        msg["success"] = True
        msg["title"] = "הושלם"
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


