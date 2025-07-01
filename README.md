# 🧠 AuraCare

_A multilingual, AI-driven mental health chatbot platform with integrated journaling, sentiment analytics, and relaxation tools._

---

## 🎥 Demo

[![Watch the demo](/screenshots/landing-page.png)](https://www.youtube.com/watch?v=izNxq7_LYQ4)


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
## 🖼️ Screenshots

## **Landing Page:**  
The welcoming homepage for AuraCare where users start their journey.  
![Landing Page](/screenshots/landing-page.png)

## **Signup Page:**  
New users can create an account with basic information.  
![Signup](/screenshots/signup.png)

## **OTP Verification:**  
Secure the signup process with OTP verification.  
![OTP Verification](/screenshots/otp-verification.png)

## **Password Verification:**  
Users set and verify their password for account security.  
![Password Verification](/screenshots/password-verification.png)

## **Login Page:**  
Returning users can log in to access their dashboard.  
![Login](/screenshots/login.jpg)

## **Forgot Password:**  
Users can initiate password recovery if they forget their credentials.  
![Forgot Password](/screenshots/forgot-password.png)

## **Forgot Password Verification:**  
Verification step for resetting passwords securely.  
![Forgot Password Verification](/screenshots/forgot-password-verification.png)

## **Dashboard:**  
Users get an overview of their activities and mental wellness stats.  
![Dashboard](/screenshots/dashboard.png)

## **Chat with English:**  
Interact with the AI chatbot in English for mental health support.  
![Chat English](/screenshots/chat-english.jpeg)

## **Chat with Tanglish:**  
Multilingual chatbot conversation in Tanglish.  
![Chat Tanglish](/screenshots/chat-tanglish.jpeg)

## **Chat with Tamil:**  
Engage with the AI in Tamil for a native language experience.  
![Chat Tamil](/screenshots/chat-tamil.jpeg)

## **Game Page:**  
Play interactive games designed for relaxation and focus.  
![Game Page](/screenshots/game-page.png)

## **Quiz Page:**  
Users can participate in fun quizzes to boost their mood.  
![Quiz Page](/screenshots/quiz-page.png)

## **Music Page:**  
Listen to soothing melodies to help relax and unwind.  
![Music Page](/screenshots/music-page.jpg)

## **Analytics Page:**  
Visualize emotional trends and sentiment analysis over time.  
![Analytics Page](/screenshots/analytics-page.png)

## **Profile:**  
Manage personal information and preferences in the user profile.  
![Profile](/screenshots/profile.png)

## **Admin Login Page:**  
Admins can securely log in to the control panel.  
![Admin Login](/screenshots/admin-login.png)

## **Admin Dashboard:**  
Overview for administrators to manage platform activities.  
![Admin Dashboard](/screenshots/admin-dashboard.png)

## **User Management:**  
Admins can view and manage user accounts and activities.  
![User Management](/screenshots/user-management.png)

## **Content Management:**  
Admin can manage the content like add new games, funny quizzes, or melody music.  
![Content Management](/screenshots/content-management.png)

## **Profile (Admin/User):**  
Admins or users can update their profile details.  
![Profile](/screenshots/profile.png)

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📝 License

[MIT](LICENSE) (or specify your license)

---

## 🙏 Acknowledgments

- Thanks to the open-source communities behind Rasa, LLaMA, TextBlob, and Flask.
- Inspired by ongoing mental health advocacy worldwide.
