import os
import sys
from flask import Flask, jsonify, session
from flask_cors import CORS
from config import Config
from database import Database
from auth.signup import signup_bp
from auth.login import login_bp
from auth.logout import logout_bp
from middleware.auth_guard import get_current_user


def create_app():
    app = Flask(__name__)

    app.config["SECRET_KEY"] = Config.SECRET_KEY
    app.config["SESSION_COOKIE_NAME"] = Config.SESSION_COOKIE_NAME
    app.config["SESSION_COOKIE_HTTPONLY"] = Config.SESSION_COOKIE_HTTPONLY
    app.config["SESSION_COOKIE_SAMESITE"] = Config.SESSION_COOKIE_SAMESITE
    app.config["SESSION_COOKIE_SECURE"] = Config.SESSION_COOKIE_SECURE
    app.config["PERMANENT_SESSION_LIFETIME"] = Config.PERMANENT_SESSION_LIFETIME

    origins = [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://localhost:5500",
        "http://localhost:8000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000",
        "http://127.0.0.1:5500",
        "http://127.0.0.1:8000",
        "https://vcart-ecommerce.vercel.app",
    ]
    if Config.FRONTEND_URL:
        origins.append(Config.FRONTEND_URL)

    CORS(
        app,
        supports_credentials=True,
        origins=origins,
    )

    app.register_blueprint(signup_bp)
    app.register_blueprint(login_bp)
    app.register_blueprint(logout_bp)

    with app.app_context():
        try:
            Database.init_db()
        except Exception as e:
            print(f"[VCart] Database initialization skipped: {e}", file=sys.stderr)

    return app


app = create_app()


@app.route("/api/auth/session", methods=["GET"])
def check_session():
    user = get_current_user()
    if user:
        return jsonify({
            "authenticated": True,
            "user": user,
        }), 200
    return jsonify({
        "authenticated": False,
        "user": None,
    }), 200


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({"status": "healthy", "message": "VCart API is running"}), 200


if __name__ == "__main__":
    debug_mode = os.getenv("FLASK_DEBUG", "1") == "1"
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=debug_mode,
    )
