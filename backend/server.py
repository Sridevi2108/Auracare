from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token
import pymysql

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)

# Secret Key for JWT
app.config['JWT_SECRET_KEY'] = 'your_secret_key'

# **User Registration**
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    email = data.get("email")
    password = data.get("password")

    if not username or not email or not password:
        return jsonify({"error": "All fields are required"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

    try:
        db = pymysql.connect(
            host="localhost",
            user="root",
            password="password",
            database="auracare_db",
            cursorclass=pymysql.cursors.DictCursor
        )
        with db.cursor() as cursor:
            sql = "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)"
            cursor.execute(sql, (username, email, hashed_password))
            db.commit()
        return jsonify({"message": "User registered successfully!"}), 201
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# **User Login**
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")

    if not username or not password:
        return jsonify({"error": "Username and password are required"}), 400

    try:
        db = pymysql.connect(
            host="localhost",
            user="root",
            password="password",
            database="auracare_db",
            cursorclass=pymysql.cursors.DictCursor
        )
        with db.cursor() as cursor:
            sql = "SELECT * FROM users WHERE username = %s"
            cursor.execute(sql, (username,))
            user = cursor.fetchone()

            if not user:
                return jsonify({"error": "User not found"}), 401

            if not bcrypt.check_password_hash(user["password"], password):
                return jsonify({"error": "Invalid credentials"}), 401

            token = create_access_token(identity={"id": user["id"], "username": user["username"]})
            return jsonify({"message": "Login successful", "token": token}), 200
    except pymysql.MySQLError as e:
        return jsonify({"error": str(e)}), 500
    finally:
        db.close()

# **Start Server**
if __name__ == "__main__":
    app.run(debug=True, port=5000)
