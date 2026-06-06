from flask import Blueprint, jsonify, session

logout_bp = Blueprint("logout", __name__)


@logout_bp.route("/api/auth/logout", methods=["POST"])
def logout():
    try:
        session.clear()

        return jsonify({
            "success": True,
            "message": "Logged out successfully",
        }), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": "An error occurred during logout.",
        }), 500
