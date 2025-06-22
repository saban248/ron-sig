from enum import Enum


class RentEquipmentStatus(Enum):
    LIVE                        = 0
    COMPLETE                    = 1
    DELETED                     = 2
    CANCELED                    = 3
    PAUSED                      = 4

    @property
    def code(self):
        return super().value
