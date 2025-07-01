# 🧠 AuraCare

_A multilingual, AI-driven mental health chatbot platform with integrated journaling, sentiment analytics, and relaxation tools._

---

## 🎥 Demo

[![Watch the demo](https://img.youtube.com/vi/izNxq7_LYQ4/0.jpg)](https://www.youtube.com/watch?v=izNxq7_LYQ4)  


---

## 📂 Project Structure

```
Auracare/
├── user-frontend/    # React + TypeScript Frontend
├── user-backend/     # Flask Backend with MongoDB & LLaMA Integration
├── admin/            # Admin dashboard and control panel
└── README.md
```

---

## 🌟 Features

### 🧑‍💼 User Frontend (React)
- Signup/Login with email verification and mental health onboarding
- Multi-language chatbot (English, Tamil, Tanglish) using Rasa + LLaMA
- Mood tracking and sentiment analysis powered by TextBlob
- Gamified wellness tools: relaxation quiz, breathing exercises, motivational quotes
- Journaling space with sentiment trend analytics
- Profile dashboard and chat history

### 🔧 Backend (Flask)
- Secure user registration & login (passwords hashed with bcrypt)
- MongoDB integration for storing user data, journal entries, and sentiment records
- AI integration: LLaMA-powered chatbot responses
- RESTful APIs for seamless frontend-backend communication

### 🔒 Admin Module (Optional)
- View anonymous user sentiment logs
- Blog management (wellness resources)
- Incident reports (for project deployments like Serenova)

---

## 💻 Tech Stack

| Layer     | Technology                          |
|-----------|-------------------------------------|
| Frontend  | React, TypeScript, CSS              |
| Backend   | Flask, Python, bcrypt               |
| Database  | MongoDB                             |
| Chatbot   | Rasa, LLaMA (local inference)       |
| AI/NLP    | TextBlob (for sentiment analysis)   |
| Auth      | Custom with bcrypt                  |
| Deployment| (Planned: Vercel / Render / Docker) |

---

## 🚀 Getting Started

### 🛠 Prerequisites
- Python 3.10+
- Node.js & npm
- MongoDB (local or cloud)
- [llama.cpp](https://github.com/ggerganov/llama.cpp) for local LLaMA inference

### 🧪 Setup Instructions

#### 1. Backend
```bash
cd user-backend
python -m venv venv
venv\Scripts\activate  # or `source venv/bin/activate` on Linux/Mac
pip install -r requirements.txt
python server.py
```
#### 2. Frontend
```bash
cd user-frontend
npm install
npm start
```

---

## 📊 Sentiment Analysis Example

User messages are analyzed using TextBlob, e.g.:
```json
{
  "message": "I'm feeling overwhelmed today",
  "sentiment": -0.5
}
```
This helps visualize emotional trends in the Analytics tab.

---

## 🌐 Multi-language Support

- English 🇬🇧
- Tamil 🇮🇳
- Tanglish 🅰️

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

[MIT](LICENSE) (or specify your license)

---

## 🙏 Acknowledgments

- Thanks to the open-source communities behind Rasa, LLaMA, TextBlob, and Flask.
- Inspired by ongoing mental health advocacy worldwide.
