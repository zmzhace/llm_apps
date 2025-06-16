from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.getenv('API_KEY')
API_URL = os.getenv('API_URL')
FLASK_PORT = int(os.getenv('FLASK_PORT', 5000))

@app.route('/api/chat', methods=['POST'])
def chat():
    try:
        data = request.json
        user_message = data.get('message')
        headers = {
            'Authorization': f'Bearer {API_KEY}',
            'Content-Type': 'application/json'
        }
        payload = {
            'messages': [
                {'role': 'user', 'content': user_message}
            ],
            'model': 'glm-4'
        }
        response = requests.post(API_URL, headers=headers, json=payload)
        response_data = response.json()
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=FLASK_PORT) 