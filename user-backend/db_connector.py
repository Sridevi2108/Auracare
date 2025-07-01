import mysql.connector


# Connect to MySQL database
def connect_db():
    return mysql.connector.connect(
        host="localhost",  # Change if using a different host
        user="root",
        password="password",
        database="auracare_db"
    )


# Register user
def register_user(username, email, password):
    db = connect_db()
    cursor = db.cursor()

    try:
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                       (username, email, password))
        db.commit()
        return "Registration successful!"
    except mysql.connector.Error as err:
        return f"Error: {err}"
    finally:
        cursor.close()
        db.close()


# Login user
def login_user(email, password):
    db = connect_db()
    cursor = db.cursor()

    cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
    user = cursor.fetchone()

    cursor.close()
    db.close()

    if user:
        return "Login successful!"
    else:
        return "Invalid credentials. Please try again."
