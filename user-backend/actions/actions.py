import requests
import re
import traceback
import datetime
import time
import mysql.connector
from langdetect import detect
from nltk.sentiment import SentimentIntensityAnalyzer
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
from textblob import TextBlob


# ==================== Utilities ====================

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="auracare_db"
    )

def detect_language(text):
    try:
        return detect(text)
    except:
        return "en"

def is_tanglish(text):
    tamil_chars = set('அஆஇஈஉஊஎஏஐஒஓஔகஙசஜஞடணதநனபமயரலவழளறனஹஶ')
    count = sum(1 for c in text if c in tamil_chars)
    return count > 0 and any(c.isalpha() and c not in tamil_chars for c in text)


def log_mood_simple(session_id, mood_score, source="chat"):
    try:
        response = requests.post(
            "http://localhost:5000/api/mood-log",
            json={
                "session_id": session_id,
                "mood": mood_score,
                "source": source,
                "timestamp": datetime.datetime.utcnow().isoformat()
            }
        )
        print(f"📊 Mood logged: {response.status_code} - {response.json()}")
    except Exception as e:
        print("❌ Failed to log mood:", e)


# ==================== User Registration ====================

class ActionRegisterUser(Action):
    def name(self):
        return "action_register_user"

    def run(self, dispatcher, tracker, domain):
        user_name = tracker.get_slot("username")
        email = tracker.get_slot("email")
        password = tracker.get_slot("password")

        db = connect_db()
        cursor = db.cursor()

        try:
            cursor.execute("INSERT INTO users (name, email, password) VALUES (%s, %s, %s)", (user_name, email, password))
            db.commit()
            dispatcher.utter_message(text="You have successfully registered!")
        except Exception as e:
            dispatcher.utter_message(text=f"Registration failed: {str(e)}")
        finally:
            cursor.close()
            db.close()

        return []

# ==================== User Login ====================

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
        cursor.close()
        db.close()

        if user:
            dispatcher.utter_message(text="Login successful! Welcome back!")
        else:
            dispatcher.utter_message(text="Invalid email or password. Please try again.")
        return []

# ==================== LLaMA Emotional Response ====================

class ActionMultilingualLlama(Action):
    def name(self):
        return "action_multilingual_llama"

    def run(self, dispatcher: CollectingDispatcher, tracker: Tracker, domain: dict):
        user_msg = tracker.latest_message.get("text", "")
        lang = detect_language(user_msg)

        analyzer = SentimentIntensityAnalyzer()
        score = analyzer.polarity_scores(user_msg)
        very_sad = len(user_msg.strip()) > 80 and score["compound"] < -0.5

        # ✅ Mood analysis using VADER (scaled from -1 to +1 → 0 to 10)
        vader_score = analyzer.polarity_scores(user_msg)
        mood_score = int((vader_score["compound"] + 1) * 5)  # Scale to 0–10

        # ✅ Get session ID
        session_id = tracker.get_slot("session_id") or tracker.sender_id

        # ✅ Log mood (source is "chat")
        log_mood_simple(session_id, mood_score, source="chat")

        if very_sad:
            dispatcher.utter_message(
                text="💙 You seem really down. Want to try something calming?",
                buttons=[
                    {"title": "🎮 Play a Game", "payload": "/trigger_game"},
                    {"title": "🎵 Listen to Music", "payload": "/trigger_music"},
                    {"title": "🧠 Take a Quiz", "payload": "/trigger_quiz"}
                ]
            )
            return []

        try:
            print("\n🦙 Using LLaMA 3 for response")
            print(f"🧠 Detected language: {lang}")
            print(f"📥 Prompt input: {user_msg}")

            prompt = self.build_prompt(user_msg, lang)
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3",
                    "prompt": prompt,
                    "stream": False,
                    "temperature": 0.6,
                    "num_predict": 25
                },
                headers={"Content-Type": "application/json"},
                timeout=100
            )
            response.raise_for_status()
            reply = response.json().get("response", "").strip()
            reply = re.sub(r'\x1b\[.*?m', '', reply)

            print(f"✅ LLaMA 3 reply:\n{reply}")

        except Exception as e:
            reply = "😓 Sorry, LLaMA 3 isn't responding. Please try again soon."
            print("❌ LLaMA 3 connection failed:")
            traceback.print_exc()

        dispatcher.utter_message(text=reply)
        return []

    def build_prompt(self, msg, lang):
      if lang == "ta":
        return (
            f"நீங்கள் ஒரு அன்பான நண்பர். கீழே உள்ள செய்திக்கு மிக எளிமையாகவும், மென்மையாகவும் "
            f"தமிழில் 2 அல்லது 3 வரிகளில் பதிலளிக்கவும்:\n\n{msg}"
        )
      elif is_tanglish(msg):
        return (
            f"You are a warm friend. Reply casually in Tanglish (Tamil + English mix), in 2 or 3 short lines:\n\n{msg}"
        )
      else:
        return (
            f"You're a kind and supportive friend. Respond in English in just 2 or 3 short lines:\n\n{msg}"
        )


        
# ==================== Navigation Actions ====================

class ActionOpenGame(Action):
    def name(self):
        return "action_open_game"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(
            text="🎮 Launching a calming game for you...",
            json_message={"navigate_to": "games"}
        )
        return []

class ActionOpenQuiz(Action):
    def name(self):
        return "action_open_quiz"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(
            text="🧠 Let's do a quick quiz together...",
            json_message={"navigate_to": "quiz"}
        )
        return []

class ActionOpenMusic(Action):
    def name(self):
        return "action_open_music"

    def run(self, dispatcher, tracker, domain):
        dispatcher.utter_message(
            text="🎵 Here's something relaxing to listen to...",
            json_message={"navigate_to": "music"}
        )
        return []
