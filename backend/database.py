import mysql.connector
from mysql.connector import pooling
from config import Config


class Database:
    _instance = None
    _pool = None

    @classmethod
    def get_pool(cls):
        if cls._pool is None:
            cls._pool = mysql.connector.pooling.MySQLConnectionPool(
                pool_name=Config.get_dsn()["pool_name"],
                pool_size=Config.get_dsn()["pool_size"],
                pool_reset_session=Config.get_dsn()["pool_reset_session"],
                host=Config.DB_HOST,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                database=Config.DB_NAME,
                port=Config.DB_PORT,
                charset=Config.get_dsn()["charset"],
                use_pure=Config.get_dsn()["use_pure"],
                autocommit=Config.get_dsn()["autocommit"],
            )
        return cls._pool

    @classmethod
    def get_connection(cls):
        pool = cls.get_pool()
        conn = pool.get_connection()
        return conn

    @classmethod
    def execute_query(cls, query, params=None, fetch_one=False, fetch_all=False):
        conn = None
        cursor = None
        try:
            conn = cls.get_connection()
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, params or ())

            if fetch_one:
                return cursor.fetchone()
            if fetch_all:
                return cursor.fetchall()

            conn.commit()
            return cursor.lastrowid

        except mysql.connector.Error as e:
            if conn and conn.is_connected():
                conn.rollback()
            raise e

        finally:
            if cursor:
                cursor.close()
            if conn and conn.is_connected():
                conn.close()

    @classmethod
    def init_db(cls):
        init_conn = None
        init_cursor = None
        try:
            init_conn = mysql.connector.connect(
                host=Config.DB_HOST,
                user=Config.DB_USER,
                password=Config.DB_PASSWORD,
                port=Config.DB_PORT,
                charset="utf8mb4",
                use_pure=True,
            )
            init_cursor = init_conn.cursor()

            try:
                init_cursor.execute(
                    f"CREATE DATABASE IF NOT EXISTS `{Config.DB_NAME}` "
                    f"CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci"
                )
            except mysql.connector.Error:
                pass

            init_cursor.execute(f"USE `{Config.DB_NAME}`")

            init_cursor.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    username VARCHAR(30) NOT NULL UNIQUE,
                    password VARCHAR(255) NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    INDEX idx_username (username)
                ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
            """)

            init_conn.commit()

        except mysql.connector.Error:
            pass

        finally:
            if init_cursor:
                init_cursor.close()
            if init_conn and init_conn.is_connected():
                init_conn.close()

    @classmethod
    def close_all(cls):
        if cls._pool:
            cls._pool = None
