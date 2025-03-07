from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import mysql.connector


# Database connection setup
def connect_db():
    return mysql.connector.connect(
        host="localhost",  # Change if your DB is hosted elsewhere
        user="root",
        password="password",
        database="auracare_db"
    )


# Action for user registration
class ActionRegisterUser(Action):
    def name(self):
        return "action_register_user"

    def run(self, dispatcher, tracker, domain):
        user_name = tracker.get_slot("user_name")
        email = tracker.get_slot("email")
        password = tracker.get_slot("password")

        db = connect_db()
        cursor = db.cursor()

        try:
            cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)",
                           (user_name, email, password))
            db.commit()
            dispatcher.utter_message(text="You have successfully registered!")
        except Exception as e:
            dispatcher.utter_message(text=f"Registration failed: {str(e)}")
        finally:
            cursor.close()
            db.close()

        return []


# Action for user login
class ActionLoginUser(Action):
    def name(self):
        return "action_login_user"

    def run(self, dispatcher, tracker, domain):
        email = tracker.get_slot("email")
        password = tracker.get_slot("password")

        db = connect_db()
        cursor = db.cursor()

        cursor.execute("SELECT * FROM users WHERE email=%s AND password=%s", (email, password))
        user = cursor.fetchone()

        if user:
            dispatcher.utter_message(text="Login successful! Welcome back!")
        else:
            dispatcher.utter_message(text="Invalid email or password. Please try again.")

        cursor.close()
        db.close()
        return []


# Action to suggest random self-care tips
import random


class ActionSelfCareTip(Action):
    def name(self):
        return "action_self_care_tip"

    def run(self, dispatcher, tracker, domain):
        tips = [
            "Take a short walk outside.",
            "Listen to your favorite music.",
            "Write down three things you're grateful for.",
            "Try a 5-minute meditation session.",
            "Drink a glass of water and take deep breaths."
        ]
        tip = random.choice(tips)
        dispatcher.utter_message(text=f"Here's a self-care tip: {tip}")
        return []
