from api.ptc import ron_app, ron_db

if __name__ == "__main__":
    with ron_app.app_context():
        ron_db.create_all()

    ron_app.run(host="0.0.0.0", port=80, debug=True)