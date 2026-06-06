from flask import Blueprint, request, jsonify, session
import bcrypt
from database import Database
import re

signup_bp = Blueprint("signup", __name__)


def validate_signup_input(username, password, confirm_password):
    errors = []

    if not username or not username.strip():
        errors.append("Username is required")

    if username and len(username.strip()) < 4:
        errors.append("Username must be at least 4 characters")

    if username and len(username.strip()) > 30:
        errors.append("Username must not exceed 30 characters")

    if username and not re.match(r"^[a-zA-Z0-9_]+$", username.strip()):
        errors.append("Username can only contain letters, numbers, and underscores")

    if not password:
        errors.append("Password is required")

    if password and len(password) < 8:
        errors.append("Password must be at least 8 characters")

    if password and len(password) > 64:
        errors.append("Password must not exceed 64 characters")

    if password != confirm_password:
        errors.append("Passwords do not match")

    return errors


@signup_bp.route("/api/auth/signup", methods=["POST"])
def signup():
    try:
        data = request.get_json()

        if not data:
            return jsonify({"success": False, "message": "Invalid request body"}), 400

        username = data.get("username", "").strip()
        password = data.get("password", "")
        confirm_password = data.get("confirm_password", "")

        validation_errors = validate_signup_input(username, password, confirm_password)

        if validation_errors:
            return jsonify({
                "success": False,
                "message": validation_errors[0],
                "errors": validation_errors,
            }), 400

        existing = Database.execute_query(
            "SELECT id FROM users WHERE username = %s",
            (username,),
            fetch_one=True,
        )

        if existing:
            return jsonify({
                "success": False,
                "message": "Username already exists",
            }), 409

        hashed = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt(rounds=12)
        )

        user_id = Database.execute_query(
            "INSERT INTO users (username, password) VALUES (%s, %s)",
            (username, hashed.decode("utf-8")),
        )

        session["user_id"] = user_id
        session["username"] = username
        session.permanent = True

        return jsonify({
            "success": True,
            "message": "Account created successfully",
            "user": {"id": user_id, "username": username},
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "An error occurred during signup. Please try again.",
        }), 500
