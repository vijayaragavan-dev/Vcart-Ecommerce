import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key-in-production")

    DB_HOST = os.getenv("DB_HOST") or os.getenv("MYSQL_HOST") or "localhost"
    DB_USER = os.getenv("DB_USER") or os.getenv("MYSQL_USER") or "root"
    DB_PASSWORD = os.getenv("DB_PASSWORD") or os.getenv("MYSQL_PASSWORD") or ""
    DB_NAME = os.getenv("DB_NAME") or os.getenv("MYSQL_DATABASE") or "vcart_db"
    DB_PORT = int(os.getenv("DB_PORT") or os.getenv("MYSQL_PORT") or 3306)

    FRONTEND_URL = os.getenv("FRONTEND_URL", "")

    SESSION_COOKIE_NAME = "vcart_session"
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = "None"
    SESSION_COOKIE_SECURE = os.getenv("SESSION_COOKIE_SECURE", "False").lower() == "true"
    SESSION_COOKIE_DOMAIN = None
    PERMANENT_SESSION_LIFETIME = 86400

    @staticmethod
    def get_dsn():
        return {
            "host": Config.DB_HOST,
            "user": Config.DB_USER,
            "password": Config.DB_PASSWORD,
            "database": Config.DB_NAME,
            "port": Config.DB_PORT,
            "charset": "utf8mb4",
            "use_pure": True,
            "pool_name": "vcart_pool",
            "pool_size": 10,
            "pool_reset_session": True,
            "autocommit": True,
        }
