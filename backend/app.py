from flask import Flask, jsonify, request
from flask_cors import CORS

from models import db, User, Menu, Order, OrderItem

app = Flask(__name__)
CORS(app)

# 🔥 DATABASE CONFIG
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/campuscrave"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)

# 🔥 INSERT FULL MENU DATA
def insert_menu():
    if Menu.query.first():
        return

    items = [

        # 🍳 BREAKFAST
        Menu(name="Poha", price=25, category="Breakfast", canteen="Hangout Canteen"),
        Menu(name="Misal Pav", price=55, category="Breakfast"),
        Menu(name="Vada Pav", price=15, category="Breakfast"),
        Menu(name="Samosa", price=18, category="Breakfast"),
        Menu(name="Sabudana Khichdi", price=45, category="Breakfast"),

        # ☕ BEVERAGES
        Menu(name="Tea", price=12, category="Beverages"),
        Menu(name="Special Tea (Big Cup)", price=30, category="Beverages"),
        Menu(name="Hot Coffee", price=30, category="Beverages"),
        Menu(name="Cold Coffee", price=45, category="Beverages"),

        # 🍟 SNACK
        Menu(name="French Fries", price=60, category="Snack"),
        Menu(name="Peri Peri Fries", price=70, category="Snack"),
        Menu(name="Cheese Fries", price=80, category="Snack"),
        Menu(name="Egg Bhurji", price=65, category="Snack"),
        Menu(name="Egg Omelette", price=65, category="Snack"),
        Menu(name="Samosa Chaat", price=40, category="Snack"),

        # 🍜 CHINESE
        Menu(name="Veg Fried Rice", price=70, category="Chinese"),
        Menu(name="Veg Schezwan Rice", price=80, category="Chinese"),
        Menu(name="Chicken Fried Rice", price=100, category="Chinese"),
        Menu(name="Chicken Schezwan Rice", price=110, category="Chinese"),
        Menu(name="Hakka Noodles", price=70, category="Chinese"),
        Menu(name="Schezwan Hakka Noodles", price=80, category="Chinese"),
        Menu(name="Chicken Hakka Noodles", price=100, category="Chinese"),
        Menu(name="Veg Steamed Momos", price=70, category="Chinese"),
        Menu(name="Veg Fried Momos", price=80, category="Chinese"),
        Menu(name="Chicken Steamed Momos", price=80, category="Chinese"),
        Menu(name="Chicken Fried Momos", price=100, category="Chinese"),

        # 🍔 BURGERS
        Menu(name="Veg Grilled Sandwich", price=60, category="Burgers"),
        Menu(name="Veg Cheese Grilled Sandwich", price=85, category="Burgers"),

        # MAIN CANTEEN DATA
        Menu(name="Poha", price=20, category="Morning Kickstart", canteen="Main Canteen"),
        Menu(name="Idli", price=30, category="Morning Kickstart", canteen="Main Canteen"),
        Menu(name="Pav Bhaji", price=70, category="Desi & Global Meals", canteen="Main Canteen"),
        Menu(name="Chole Bhature", price=70, category="Desi & Global Meals", canteen="Main Canteen"),
    ]

    db.session.add_all(items)
    db.session.commit()


# 🔥 CREATE TABLES + INSERT MENU
with app.app_context():
    db.create_all()
    insert_menu()


@app.route("/")
def home():
    return "CampusCrave API Running 🚀"


# ✅ GET MENU (FIXED INDENTATION)
@app.route("/menu/<path:canteen>", methods=["GET"])
def get_menu(canteen):
    from sqlalchemy import or_

    items = Menu.query.filter(
        or_(Menu.canteen == canteen, Menu.canteen == None)
    ).all()

    return jsonify([
        {
            "id": i.id,
            "name": i.name,
            "price": i.price,
            "category": i.category,
            "canteen": i.canteen
        } for i in items
    ])


# ✅ PLACE ORDER
@app.route("/order", methods=["POST"])
def place_order():
    data = request.json

    order = Order(
        user_id=data.get("user_id", 1),
        total_price=data.get("total_price", 0)
    )
    db.session.add(order)
    db.session.commit()

    for item in data.get("items", []):
        order_item = OrderItem(
            order_id=order.id,
            item_name=item["name"],
            quantity=item.get("qty", 1),
            price=item["price"]
        )
        db.session.add(order_item)

    db.session.commit()

    return jsonify({
        "message": "Order placed successfully",
        "order_id": order.id
    })


# ✅ GET ALL ORDERS (FIXED POSITION)
@app.route("/orders", methods=["GET"])
def get_orders():
    orders = Order.query.all()

    return jsonify([
        {
            "id": o.id,
            "user_id": o.user_id,
            "total_price": o.total_price,
            "order_time": o.order_time
        } for o in orders
    ])


if __name__ == "__main__":
    app.run(debug=True)