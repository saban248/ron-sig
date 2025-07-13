from enum import Enum


class RentEquipmentStatus(Enum):
    UNKNOWN                     = -1
    LIVE                        = 0
    COMPLETE                    = 1
    DELETED                     = 2
    CANCELED                    = 3

    @property
    def code(self):
        return super().value

    @staticmethod
    def get(code:int):
        for item in RentEquipmentStatus:
            if item.code == code:
                return item

        return RentEquipmentStatus.UNKNOWN