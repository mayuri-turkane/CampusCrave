from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow React to access backend

menu = {
    "Breakfast": [
        {"name": "Poha", "price": 25},
        {"name": "Misal Pav", "price": 55},
        {"name": "Vada Pav", "price": 15}
    ]
}

@app.route("/")
def home():
    return "CampusCrave API Running 🚀"

@app.route("/menu")
def get_menu():
    return jsonify(menu)

if __name__ == "__main__":
    app.run(debug=True)