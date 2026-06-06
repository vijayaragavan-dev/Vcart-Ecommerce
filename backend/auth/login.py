from flask import Blueprint, request, jsonify, session
import bcrypt
from database import Database

login_bp = Blueprint("login", __name__)


@login_bp.route("/api/auth/login", methods=["POST"])
def login():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "Invalid request body"}), 400

        username = data.get("username", "").strip()
        password = data.get("password", "")

        if not username:
            return jsonify({"success": False, "message": "Username is required"}), 400

        if not password:
            return jsonify({"success": False, "message": "Password is required"}), 400

        user = Database.execute_query(
            "SELECT id, username, password FROM users WHERE username = %s",
            (username,),
            fetch_one=True,
        )

        if not user:
            return jsonify({
                "success": False,
                "message": "Invalid username or password",
            }), 401

        stored_hash = user["password"]
        if isinstance(stored_hash, str):
            stored_hash = stored_hash.encode("utf-8")

        if not bcrypt.checkpw(password.encode("utf-8"), stored_hash):
            return jsonify({
                "success": False,
                "message": "Invalid username or password",
            }), 401

        session["user_id"] = user["id"]
        session["username"] = user["username"]
        session.permanent = True

        return jsonify({
            "success": True,
            "message": "Login successful",
            "user": {"id": user["id"], "username": user["username"]},
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "An error occurred during login. Please try again.",
        }), 500
