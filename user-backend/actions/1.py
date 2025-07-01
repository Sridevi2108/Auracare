import requests
from nltk.sentiment import SentimentIntensityAnalyzer
from rasa_sdk import Action, Tracker
from rasa_sdk.executor import CollectingDispatcher
import mysql.connector
from textblob import TextBlob
from langdetect import detect
import subprocess
import re
import traceback
import psutil

# ──────────────── LLaMA Startup Management ────────────────

def is_ollama_running():
    for proc in psutil.process_iter(attrs=['cmdline']):
        if proc.info['cmdline'] and "ollama" in proc.info['cmdline'] and "llama3" in proc.info['cmdline']:
            return True
    return False

def start_ollama_if_not_running():
    if not is_ollama_running():
        print("🚀 Starting Ollama with LLaMA3...")
        subprocess.Popen(["ollama", "run", "llama3"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    else:
        print("✅ Ollama is already running.")

def warmup_llama():
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={"model": "llama3", "prompt": "hi", "stream": False},
            timeout=10
        )
        response.raise_for_status()
        print("✅ LLaMA warm-up successful.")
        return True
    except:
        print("❌ Warm-up failed.")
        return False

# Call this once at the beginning
start_ollama_if_not_running()

# ──────────────── Database Connection ────────────────

def connect_db():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="password",
        database="auracare_db"
    )

# ──────────────── Rasa Actions ────────────────

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

# ──────────────── Multilingual LLaMA Action ────────────────

class ActionMultilingualLlama(Action):
    def name(self):
        return "action_multilingual_llama"

    def run(self, dispatcher: CollectingDispatcher,
            tracker: Tracker,
            domain: dict):

        user_msg = tracker.latest_message.get("text")
        lang = self.detect_language(user_msg)

        start_ollama_if_not_running()

        if not warmup_llama():
            dispatcher.utter_message(text="🧠 LLaMA is still loading... Try again shortly.")
            return []

        # ───── Prompt Building ─────
        if lang == "ta":
            prompt = f"""நீங்கள் ஒரு கனிவான மற்றும் உணர்வுபூர்வமான மனநல ஆலோசகர். பயனர் கூறியது: "{user_msg}". தமிழில் 2 முதல் 3 வரிகளுக்குள் பதிலளிக்கவும். பதில் ஆதரவாகவும் நேரடியாகவும் இருக்க வேண்டும்."""
        elif self.is_tanglish(user_msg):
            prompt = f"""You are a kind AI therapist. Reply in Tanglish (Tamil in English letters), friendly tone, 2–3 lines max:\nUser: {user_msg}"""
        else:
            prompt = f"""You are a mental wellness assistant. Write a brief, warm, encouraging reply in 2–3 lines:\nUser: {user_msg}"""

        print("🔥 Prompt to LLaMA:", prompt)

        # ───── LLaMA API Call ─────
        try:
            response = requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "llama3",
                    "prompt": prompt,
                    "stream": False,
                    "options": {
                        "num_predict": 60,
                        "temperature": 0.7
                    }
                },
                headers={"Content-Type": "application/json"},
                timeout=15
            )

            response.raise_for_status()
            result = response.json()
            reply = result.get("response", "").strip()
            reply = re.sub(r'\x1b\[.*?m', '', reply)
            reply = reply.encode("utf-8", errors="ignore").decode("utf-8")

        except Exception as e:
            print("❌ LLaMA ERROR:")
            traceback.print_exc()
            reply = "Sorry, my AI brain is having a tough time. Please try again in a moment."

        dispatcher.utter_message(text=reply)
        return []

    def detect_language(self, text):
        try:
            return detect(text)
        except:
            return "en"

    def is_tanglish(self, text):
        tamil_chars = set('அஆஇஈஉஊஎஏஐஒஓஔகஙசஜஞடணதநனபமயரலவழளறனஹஶ')
        count = sum(1 for c in text if c in tamil_chars)
        return count > 0 and any(c.isalpha() and c not in tamil_chars for c in text)
