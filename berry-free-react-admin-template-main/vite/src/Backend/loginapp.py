from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow frontend requests


users = []

app.route('/api/register', methods=['GET', 'POST'])
def register():
    if request.method == 'GET':
        return jsonify({"users": users})  # Returns all registered users

    if request.method == 'POST':
        data = request.get_json()  # Get JSON data from request
        print("Received Data:", data)  # Debugging print

        if not data or 'email' not in data or 'password' not in data:
            return jsonify({"error": "Invalid data"}), 400

        users.append(data)  # Store user data (temporary)
        return jsonify({"message": "User registered successfully", "user": data}), 201

if __name__ == '__main__':
    app.run(debug=True, port=5000)
