import time
from typing import Union

from api.general import get_safe_time_by_picker, short_time_until
from api.ptc import ron_app


@ron_app.template_global()
def get_first_word_fullname(fullname:str):
    return fullname[0].upper()

@ron_app.template_global()
def get_float_string(f:float):
    return str(float(f)).split(".")

@ron_app.template_global()
def get_number_clearly(n:Union[str, int]):
    return f"{int(n):,}"


@ron_app.template_global()
def is_end_rent_event(_time:str):
    return get_safe_time_by_picker(_time) < time.time()

@ron_app.template_global()
def get_beautiful_until_time(_time:str):
    return short_time_until(get_safe_time_by_picker(_time))