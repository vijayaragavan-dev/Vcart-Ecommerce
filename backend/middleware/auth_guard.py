from functools import wraps
from flask import session, jsonify


def login_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if "user_id" not in session:
            return jsonify({
                "success": False,
                "message": "Authentication required. Please log in.",
            }), 401
        return f(*args, **kwargs)
    return decorated


def get_current_user():
    if "user_id" in session and "username" in session:
        return {
            "id": session["user_id"],
            "username": session["username"],
        }
    return None
