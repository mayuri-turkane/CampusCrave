from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from models import db, User, Menu, Order, OrderItem, Group, GroupMember

app = Flask(__name__)
CORS(app)
bcrypt = Bcrypt(app)

# 🔥 DATABASE CONFIG
app.config["SQLALCHEMY_DATABASE_URI"] = "mysql+pymysql://root:@localhost/campuscrave"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)


# ✅ USER REGISTRATION
@app.route("/register", methods=["POST"])
def register():
    data = request.json
    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400

    hashed_pw = bcrypt.generate_password_hash(password).decode('utf-8')
    new_user = User(name=name, email=email, password=hashed_pw)

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully!"}), 201


# ✅ USER LOGIN
@app.route("/login", methods=["POST"])
def login():
    data = request.json
    email = data.get("email")
    password = data.get("password")

    user = User.query.filter_by(email=email).first()

    if user and bcrypt.check_password_hash(user.password, password):
        return jsonify({
            "message": "Login successful",
            "user": {
                "id": user.id,
                "name": user.name,
                "email": user.email
            }
        }), 200

    return jsonify({"error": "Invalid email or password"}), 401


# 🔥 INSERT FULL MENU DATA
def insert_menu():
    if Menu.query.first():
        return

    items = []

    # --- HANGOUT CAFE DATA (Canteen: 'hangout') ---
    hangout_data = {
        "breakfast": [
            {"name": "Poha", "price": 25, "desc": "Light Maharashtrian breakfast with peanuts", "img": "Pohe.jpg"},
            {"name": "Vada Pav", "price": 15, "desc": "Mumbai's iconic street food burger", "img": "Vadapav.png"},
            {"name": "Samosa", "price": 18, "desc": "Crispy fried snack with spicy filling", "img": "samosa.jpg"},
            {"name": "Sabudana Khichdi", "price": 45, "desc": "Light and healthy fasting dish", "img": "sabudana_khichdi.jpg"},
        ],
        "beverages": [
            {"name": "Tea", "price": 12, "desc": "Regular chai", "img": "Tea.jpg"},
            {"name": "Cold coffee", "price": 50, "desc": "Strong and refreshing Cold coffee", "img": "Cold_coffee.jpg"},
            {"name": "Hot Coffee", "price": 30, "desc": "Freshly brewed hot coffee", "img": "coffee.jpg"},
        ],
        "snacks": [
            {"name": "French Fries", "price": 60, "desc": "Crispy salted fries", "img": "Fries.jpg"},
            {"name": "Peri Peri Fries", "price": 70, "desc": "Spicy peri peri fries", "img": "Fries.jpg"},
            {"name": "Cheese Fries", "price": 80, "desc": "Loaded cheesy fries", "img": "Fries.jpg"},
            {"name": "Egg Bhurji", "price": 65, "desc": "Spicy scrambled eggs", "img": "egg_bhurji.jpg"},
            {"name": "Egg Omelette", "price": 65, "desc": "Classic omelette", "img": "omelette.jpg"},
            {"name": "Samosa Chaat", "price": 40, "desc": "Tangy and spicy chaat", "img": "samosa_chaat.jpg"},
        ],
        "chinese": [
            {"name": "Veg Fried Rice", "price": 70, "desc": "Classic vegetable fried rice", "img": "FriedRice.png"},
            {"name": "Veg Schezwan Rice", "price": 80, "desc": "Spicy schezwan rice", "img": "FriedRice.png"},
            {"name": "Chicken Fried Rice", "price": 100, "desc": "Fried rice with chicken", "img": "FriedRice.png"},
            {"name": "Chicken Schezwan Rice", "price": 110, "desc": "Spicy chicken schezwan rice", "img": "FriedRice.png"},
            {"name": "Hakka Noodles", "price": 70, "desc": "Classic hakka noodles", "img": "Noodles.png"},
            {"name": "Chicken Hakka Noodles", "price": 100, "desc": "Chicken hakka noodles", "img": "Noodles.png"},
            {"name": "Veg Steamed Momos", "price": 70, "desc": "Steamed veg dumplings", "img": "Momos.jpg"},
            {"name": "Veg Fried Momos", "price": 80, "desc": "Fried veg dumplings", "img": "Momos.jpg"},
            {"name": "Chicken Steamed Momos", "price": 80, "desc": "Steamed chicken momos", "img": "Momos.jpg"},
            {"name": "Chicken Fried Momos", "price": 100, "desc": "Fried chicken momos", "img": "Momos.jpg"},
        ],
        "breads": [
            {"name": "Veg Grilled Sandwich", "price": 60, "desc": "Grilled veg sandwich", "img": "sandwich.jpg"},
            {"name": "Veg Cheese Grilled Sandwich", "price": 85, "desc": "Cheesy grilled sandwich", "img": "sandwich.jpg"},
            {"name": "Chicken Sandwich", "price": 80, "desc": "Simple chicken sandwich", "img": "sandwich.jpg"},
            {"name": "Veg Burger", "price": 70, "desc": "Classic veg burger", "img": "burger.jpg"},
            {"name": "Veg Cheese Burger", "price": 95, "desc": "Burger with cheese", "img": "burger.jpg"},
            {"name": "Chicken Burger", "price": 90, "desc": "Juicy chicken burger", "img": "burger.jpg"},
            {"name": "Chicken Cheese Burger", "price": 115, "desc": "Loaded chicken cheese burger", "img": "burger.jpg"},
            {"name": "Veg Pizza (11 inch)", "price": 150, "desc": "Classic veg pizza", "img": "Pizza.jpg"},
            {"name": "Chicken Pizza (11 inch)", "price": 200, "desc": "Chicken loaded pizza", "img": "Pizza.jpg"},
        ]
    }

    # --- MAIN CANTEEN DATA (Canteen: 'main') ---
    main_data = {
        "morning": [
            {"name": "Poha", "price": 20, "desc": "Light Maharashtrian breakfast", "img": "Pohe.jpg"},
            {"name": "Idli", "price": 30, "desc": "Soft idli with chutney & sambar", "img": "Idli.png"},
            {"name": "Upma", "price": 30, "desc": "Healthy semolina breakfast", "img": "Upma.png"},
            {"name": "Dosa", "price": 50, "desc": "Crispy dosa with chutney", "img": "south.png"},
            {"name": "Vada Sambar", "price": 40, "desc": "Crispy vada with sambar", "img": "south.png"},
            {"name": "Sabudana Khichdi", "price": 45, "desc": "Fasting special dish", "img": "sabudana_khichdi.jpg"},
        ],
        "street": [
            {"name": "Vada Pav", "price": 20, "desc": "Mumbai street food", "img": "Vadapav.png"},
            {"name": "Samosa", "price": 20, "desc": "Crispy samosa", "img": "samosa.jpg"},
            {"name": "Misal Pav", "price": 60, "desc": "Spicy curry with pav", "img": "misal_pav.jpg"},
            {"name": "Dabeli", "price": 30, "desc": "Spicy dabeli", "img": "Dabeli.png"},
            {"name": "Sabudana Vada", "price": 40, "desc": "Fried sabudana snack", "img": "Sabudanavada.png"},
        ],
        "quick_fix": [
            {"name": "French Fries", "price": 60, "desc": "Crispy fries", "img": "Fries.jpg"},
            {"name": "Peri Peri Fries", "price": 70, "desc": "Spicy fries", "img": "Fries.jpg"},
            {"name": "Sandwich", "price": 50, "desc": "Veg sandwich", "img": "sandwich.jpg"},
            {"name": "Omelette", "price": 40, "desc": "Egg omelette", "img": "Omlete.png"},
            {"name": "Dhokla", "price": 40, "desc": "Soft Gujarati snack", "img": "Dhokla.png"},
        ],
        "sip_chill": [
            {"name": "Tea", "price": 12, "desc": "Regular chai", "img": "Tea.jpg"},
            {"name": "Coffee", "price": 30, "desc": "Hot coffee", "img": "coffee.jpg"},
            {"name": "Cold Coffee", "price": 45, "desc": "Chilled coffee", "img": "Cold_coffee.jpg"},
            {"name": "Taak", "price": 20, "desc": "Refreshing buttermilk", "img": "Taak.png"},
            {"name": "Dahi", "price": 25, "desc": "Fresh curd", "img": "Dahi.jpg"},
        ],
        "meals": [
            {"name": "Pav Bhaji", "price": 70, "desc": "Spicy mashed veggies", "img": "Pavbhaji.png"},
            {"name": "Chole Bhature", "price": 70, "desc": "Punjabi special meal", "img": "Cholebhature.png"},
            {"name": "Aloo Paratha", "price": 50, "desc": "Stuffed paratha with butter", "img": "Aloo_paratha.png"},
            {"name": "Fried Rice", "price": 80, "desc": "Veg fried rice", "img": "FriedRice.png"},
            {"name": "Noodles", "price": 70, "desc": "Hakka noodles", "img": "Noodles.png"},
            {"name": "Pasta", "price": 90, "desc": "Creamy pasta", "img": "passta.jpg"},
            {"name": "Maggi (Plain)", "price": 40, "desc": "Simple maggi", "img": "Maggie.jpg"},
            {"name": "Maggi (Masala)", "price": 50, "desc": "Spicy maggi", "img": "Maggie.jpg"},
        ]
    }

    # Loop to create objects
    for cat, product_list in hangout_data.items():
        for p in product_list:
            items.append(Menu(name=p['name'], price=p['price'], desc=p['desc'], category=cat, canteen="hangout", image_url=p['img']))

    for cat, product_list in main_data.items():
        for p in product_list:
            items.append(Menu(name=p['name'], price=p['price'], desc=p['desc'], category=cat, canteen="main", image_url=p['img']))

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
    # This ensures we get items for the specific canteen
    items = Menu.query.filter_by(canteen=canteen).all()

    return jsonify([
        {
            "id": i.id,
            "name": i.name,
            "price": i.price,
            "category": i.category,
            "canteen": i.canteen,
            "desc": i.desc,
            "image_url": i.image_url
        } for i in items
    ])


# ✅ PLACE ORDER (Updated to find user by email)
@app.route("/order", methods=["POST"])
def place_order():
    data = request.json
    user_email = data.get("email")  # Sent from frontend localStorage

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    order = Order(
        user_id=user.id,
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
    return jsonify({"message": "Order placed successfully", "order_id": order.id})


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


# ✅ CREATE GROUP API
@app.route("/create-group", methods=["POST"])
def create_group():
    data = request.json

    group = Group(
        name=data.get("name"),
        created_by=data.get("user_id")
    )
    db.session.add(group)
    db.session.commit()

    for member in data.get("members", []):
        gm = GroupMember(
            group_id=group.id,
            member_name=member
        )
        db.session.add(gm)

    db.session.commit()

    return jsonify({
        "message": "Group created successfully",
        "group_id": group.id
    })

if __name__ == "__main__":
    app.run(debug=True)