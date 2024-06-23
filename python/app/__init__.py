from flask import Flask
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()
migrate = Migrate()
def create_app():
    app = Flask(__name__)
    app.config.from_object('config.Config')

    db.init_app(app)
    migrate.init_app(app, db)
    with app.app_context():
        from .routes import course_routes,user_routes
        app.register_blueprint(course_routes.bp,url_prefix='/api/course')
        app.register_blueprint(user_routes.bp,url_prefix='/api/user')
        db.create_all()

    return app
