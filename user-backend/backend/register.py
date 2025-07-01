import mysql.connector


def register_user(username, email, password):
    try:
        conn = mysql.connector.connect(
            host="localhost", user="root", password="password", database="auracare_db"
        )
        cursor = conn.cursor()

        # Check if user exists
        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
        existing_user = cursor.fetchone()

        if existing_user:
            return False  # User already exists

        # Insert new user
        cursor.execute("INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                       (username, email, password))
        conn.commit()
        return True

    except mysql.connector.Error as err:
        print(f"Database Error: {err}")
        return False

    finally:
        cursor.close()
        conn.close()
