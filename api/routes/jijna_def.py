from api.ptc import ron_app


@ron_app.template_global()
def get_first_word_fullname(fullname:str):
    return fullname[0].upper()