from api.routes.r_json import *
from api.routes.r_pages import *
from api.routes.jijna_def import *
from api.ptc import *



if __name__ == "__main__":
    with ron_app.app_context():
        ron_db.create_all()
        # ApiManager.add_manager("roni",
        #                        "Roni Moshvich",
        #                        "QWaszxR0",
        #                        "0546999799",
        #                        "djronaldo_m@otmail.com",
        #                        "127.0.0.1",
        #                        "Unknown",
        #                        "304678790",
        #                        "רובוטיקה הגברה ותאורה",
        #                        "רוני מושביץ")
    ron_app.run(host="0.0.0.0", port=80, debug=True)