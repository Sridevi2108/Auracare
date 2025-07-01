from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import bcrypt
from datetime import datetime, timedelta
from bson import ObjectId


app = Flask(__name__)
CORS(app)

# MongoDB setup
client = MongoClient("mongodb://localhost:27017/")
db     = client["auracare"]
users_collection = db.users  # ✅ add this line
quiz_col = db["quiz"]   

# --------------------- Signup ---------------------
@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json() or {}
    name, email, password, avatar = (
        data.get("name"),
        data.get("email"),
        data.get("password"),
        data.get("avatar")
    )

    if not name or not email or not password:
        return jsonify({"error": "Missing required fields"}), 400

    if db.users.find_one({"email": email}):
        return jsonify({"message": "Email already exists"}), 409

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt())
    user_doc = {
        "name": name,
        "email": email,
        "password": hashed,
        "avatar": avatar,
        "is_profile_complete": False
    }
    res = db.users.insert_one(user_doc)
    if res.inserted_id:
        user_doc.pop("password")
        user_doc["_id"] = str(res.inserted_id)
        return jsonify(user_doc), 201

    return jsonify({"message": "Signup failed"}), 500

# --------------------- Login ---------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    email, password = data.get("email"), data.get("password")
    if not email or not password:
        return jsonify({"error": "Missing email or password"}), 400

    user = db.users.find_one({"email": email})
    if user and bcrypt.checkpw(password.encode(), user["password"]):
        user["_id"] = str(user["_id"])
        user.pop("password")
        return jsonify({"message": "Login successful", "user": user}), 200

    return jsonify({"error": "Invalid email or password"}), 401

# --------------------- Fetch Profile ---------------------
@app.route('/profile/<email>', methods=['GET'])
def get_profile(email):
    user = db.users.find_one({"email": email}, {"password": 0})
    if not user:
        return jsonify({"success": False, "message": "User not found"}), 404
    user["_id"] = str(user["_id"])
    return jsonify({"success": True, "data": user}), 200

# --------------------- Update Profile ---------------------
@app.route('/update-profile', methods=['POST'])
def update_profile():
    data = request.get_json() or {}
    email = data.get("email")
    if not email:
        return jsonify({"error": "Email is required"}), 400

    update = {
        "name": data.get("name"),
        "dob": data.get("dob"),
        "location": data.get("location"),
        "bio": data.get("bio"),
        "is_profile_complete": True
    }
    res = db.users.update_one({"email": email}, {"$set": update})
    if res.modified_count:
        return jsonify({"success": True, "message": "Profile updated successfully"}), 200
    return jsonify({"success": False, "message": "No profile changes made"}), 200

# --------------------- Log Chat Message ---------------------
@app.route('/api/log-message', methods=['POST'])
def log_message():
    data       = request.get_json() or {}
    user_email = data.get("email")      or data.get("userEmail")
    sender     = data.get("sender")
    message    = data.get("message")
    session_id = data.get("session_id") or data.get("sessionId")
    timestamp  = data.get("timestamp")  or datetime.utcnow()

    if not user_email or not sender or not message or not session_id:
        return jsonify({"error": "Missing required fields"}), 400

    # ensure session tracked
    db.sessions.update_one(
        {"session_id": session_id},
        {"$setOnInsert": {
            "session_id": session_id,
            "email":      user_email,
            "created_at": timestamp
        }},
        upsert=True
    )
    db.messages.insert_one({
        "email":      user_email,
        "sender":     sender,
        "message":    message,
        "session_id": session_id,
        "timestamp":  timestamp
    })
    return jsonify({"success": True, "message": "Message logged"}), 200

# --------------------- Fetch Session Messages ---------------------
@app.route('/api/session-messages', methods=['POST'])
def get_session_messages():
    data       = request.get_json() or {}
    email      = data.get("email")      or data.get("userEmail")
    session_id = data.get("session_id") or data.get("sessionId")
    if not email or not session_id:
        return jsonify({"error": "Missing email or session_id"}), 400

    docs = db.messages.find({"email": email, "session_id": session_id}).sort("timestamp", 1)
    messages = [{
        "_id":        str(d["_id"]),
        "sender":     d["sender"],
        "message":    d["message"],
        "session_id": d["session_id"],
        "timestamp":  d["timestamp"].isoformat() if hasattr(d["timestamp"], "isoformat") else d["timestamp"]
    } for d in docs]
    return jsonify({"success": True, "messages": messages}), 200

# --------------------- User’s Sessions List ---------------------

@app.route('/api/sessions/<email>', methods=['GET'])
def get_user_sessions(email):
    # Read from the sessions collection (where you upsert in log-message)
    docs = db.sessions.find({"email": email})
    sessions = []
    for doc in docs:
        # doc["created_at"] is already a datetime
        ts = doc.get("created_at", datetime.utcnow())
        # Convert to ISO string
        iso = ts.isoformat() if hasattr(ts, "isoformat") else ts
        sessions.append({
            "id":         doc["session_id"],
            "created_at": iso
        })

    return jsonify({"success": True, "sessions": sessions}), 200


# --------------------- Mood Logging ---------------------
# --------------------- Mood Logging (Fixed with Emotion) ---------------------
@app.route('/api/mood-log', methods=['POST'])
def log_mood():
    data       = request.get_json() or {}
    session_id = data.get("session_id") or data.get("sessionId")
    user_email = data.get("email")      or data.get("userEmail")
    mood       = data.get("mood")
    timestamp  = data.get("timestamp")  or datetime.utcnow()

    if not session_id or not user_email or mood is None:
        return jsonify({"error": "Missing session_id, email, or mood"}), 400

    # Auto determine emotion from mood score
    def determine_emotion(mood_score):
        if mood_score >= 8:
            return "Happy"
        elif mood_score >= 5:
            return "Neutral"
        elif mood_score >= 3:
            return "Sad"
        else:
            return "Anxious"

    emotion = determine_emotion(mood)

    db.sessions.update_one(
        {"session_id": session_id},
        {"$setOnInsert": {"session_id": session_id, "email": user_email, "created_at": timestamp}},
        upsert=True
    )
    db.mood_logs.insert_one({
        "session_id":  session_id,
        "email":       user_email,
        "mood":        mood,
        "emotion":     emotion,  # ✅ Added emotion here
        "timestamp":   timestamp
    })
    return jsonify({"success": True, "message": "Mood logged with emotion"}), 200

# --------------------- Retrieve Mood Logs by Session ---------------------
@app.route('/api/mood-logs/session/<session_id>', methods=['GET'])
def get_mood_logs_by_session(session_id):
    logs = list(db.mood_logs.find({"session_id": session_id}, {"_id": 0}))
    return jsonify({"moods": logs}), 200

# --------------------- Retrieve Mood Logs by Email ---------------------
@app.route('/api/mood-logs/email/<email>', methods=['GET'])
def get_mood_logs_by_email(email):
    logs = list(db.mood_logs.find({"email": email}, {"_id": 0}))
    return jsonify({"moods": logs}), 200

# --------------------- Activity Logging ---------------------
@app.route('/api/activity-log', methods=['POST'])
def log_activity():
    data     = request.get_json() or {}
    email    = data.get("email")
    activity = data.get("activity")
    duration = data.get("duration")
    timestamp = datetime.utcnow()

    if not email or not activity or not duration:
        return jsonify({"error": "Missing fields"}), 400

    db.activities.insert_one({
        "email":     email,
        "activity":  activity,
        "duration":  duration,
        "timestamp": timestamp
    })
    return jsonify({"success": True, "message": "Activity logged"}), 200

# --------------------- Activity Summary ---------------------
@app.route('/api/activity-summary/<email>', methods=['GET'])
def activity_summary(email):
    pipeline = [
        {"$match": {"email": email}},
        {"$group": {"_id": "$activity", "totalSeconds": {"$sum": "$duration"}}}
    ]
    results = list(db.activities.aggregate(pipeline))
    summary = [{"name": r["_id"], "minutes": round(r["totalSeconds"] / 60, 1)} for r in results]
    return jsonify({"success": True, "activities": summary}), 200

# --------------------- Message History by Date ---------------------
@app.route('/api/message-history', methods=['POST'])
def message_history():
    data     = request.get_json() or {}
    email    = data.get("email")
    date_str = data.get("date")  # YYYY-MM-DD

    if not email or not date_str:
        return jsonify({"success": False, "message": "Missing email or date"}), 400

    try:
        start = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        return jsonify({"success": False, "message": "Invalid date format"}), 400

    end = start + timedelta(days=1)
    docs = db.messages.find({
        "email":     email,
        "timestamp": {"$gte": start, "$lt": end}
    }).sort("timestamp", 1)

    history = [{
        "id":        str(d["_id"]),
        "sender":    d["sender"],
        "message":   d["message"],
        "timestamp": d["timestamp"].isoformat()
    } for d in docs]
    return jsonify({"success": True, "messages": history}), 200


# --------------------- User’s Full Sessions (With Created Time) ---------------------
@app.route('/api/user-sessions/<email>', methods=['GET'])
def get_sessions_with_created_at(email):
    sessions = list(db.sessions.find({"email": email}, {"_id": 0}))  # fetch from sessions collection
    return jsonify({"success": True, "sessions": sessions}), 200


# --------------------- Get All Users (Admin) ---------------------
@app.route('/api/users', methods=['GET'])
def get_all_users():
    users = list(users_collection.find({}, {"password": 0}))  # exclude password
    for user in users:
        user["_id"] = str(user["_id"])
        user["role"] = user.get("role", "User")      # default role: User
        user["status"] = user.get("status", "Active") # default status: Active
        user["lastLogin"] = user.get("lastLogin")     # optional: handle last login if you store it
    return jsonify({"success": True, "users": users}), 200



# --------------------- Quiz CRUD Endpoints ---------------------

# GET all quizzes
@app.route('/api/quiz', methods=['GET'])
def list_quizzes():
    docs = db.quiz.find({})
    quizzes = []
    for d in docs:
        quizzes.append({
            "id":         str(d["_id"]),
            "question":   d.get("question"),
            "options":    d.get("options", []),
            "answer":     d.get("answer"),
            "category":   d.get("category"),
            "difficulty": d.get("difficulty")
        })
    return jsonify({"success": True, "questions": quizzes}), 200

# POST a new quiz
@app.route('/api/quiz', methods=['POST'])
def create_quiz():
    data = request.get_json() or {}
    # you could add validation here
    res = db.quiz.insert_one({
        "question":   data.get("question"),
        "options":    data.get("options", []),
        "answer":     data.get("answer"),
        "category":   data.get("category"),
        "difficulty": data.get("difficulty")
    })
    if res.inserted_id:
        return jsonify({"success": True, "id": str(res.inserted_id)}), 201
    return jsonify({"success": False}), 500

# PUT (update) an existing quiz
@app.route('/api/quiz/<quiz_id>', methods=['PUT'])
def update_quiz(quiz_id):
    data = request.get_json() or {}
    result = db.quiz.update_one(
        {"_id": ObjectId(quiz_id)},
        {"$set": {
            "question":   data.get("question"),
            "options":    data.get("options"),
            "answer":     data.get("answer"),
            "category":   data.get("category"),
            "difficulty": data.get("difficulty")
        }}
    )
    if result.modified_count:
        return jsonify({"success": True}), 200
    return jsonify({"success": False}), 200

# DELETE a quiz
@app.route('/api/quiz/<quiz_id>', methods=['DELETE'])
def delete_quiz(quiz_id):
    result = db.quiz.delete_one({"_id": ObjectId(quiz_id)})
    if result.deleted_count:
        return jsonify({"success": True}), 200
    return jsonify({"success": False}), 404


# ————— List all tracks —————
@app.route('/api/music', methods=['GET'])
def list_music():
    docs = list(db.music.find())
    # convert ObjectId → string and rename to `id`
    music = []
    for d in docs:
        d['id'] = str(d.pop('_id'))
        music.append(d)
    return jsonify({ 'success': True, 'music': music }), 200

# ————— Create a track —————
@app.route('/api/music', methods=['POST'])
def create_music():
    data = request.get_json() or {}
    # validate required fields here...
    res = db.music.insert_one({
      'title':       data['title'],
      'description': data['description'],
      'duration':    data['duration'],
      'url':         data['url'],
      'category':    data['category']
    })
    new = db.music.find_one({'_id': res.inserted_id})
    new['id'] = str(new.pop('_id'))
    return jsonify({ 'success': True, 'music': new }), 201

# ————— Update a track —————
@app.route('/api/music/<string:music_id>', methods=['PUT'])
def update_music(music_id):
    data = request.get_json() or {}
    try:
        oid = ObjectId(music_id)
    except:
        return jsonify({ 'success': False, 'error': 'Invalid id' }), 400

    res = db.music.update_one(
      {'_id': oid},
      {'$set': {
         'title':       data.get('title'),
         'description': data.get('description'),
         'duration':    data.get('duration'),
         'url':         data.get('url'),
         'category':    data.get('category')
      }}
    )
    if res.modified_count:
        return jsonify({ 'success': True }), 200
    return jsonify({ 'success': False, 'error': 'Nothing changed' }), 200

# ————— Delete a track —————
@app.route('/api/music/<string:music_id>', methods=['DELETE'])
def delete_music(music_id):
    try:
        oid = ObjectId(music_id)
    except:
        return jsonify({ 'success': False, 'error': 'Invalid id' }), 400

    res = db.music.delete_one({'_id': oid})
    if res.deleted_count:
        return jsonify({ 'success': True }), 200
    return jsonify({ 'success': False, 'error': 'Not found' }), 404

if __name__ == '__main__':
    app.run(debug=True)
