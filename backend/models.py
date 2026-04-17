from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

# 👤 USERS TABLE
class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    email = db.Column(db.String(100))


# 🍽️ MENU TABLE
class Menu(db.Model):
    __tablename__ = "menu"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100))
    price = db.Column(db.Float)
    category = db.Column(db.String(50))

    # ✅ FIXED: removed default so you can assign correct canteen
    canteen = db.Column(db.String(100), nullable=False)


# 🧾 ORDERS TABLE
class Order(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    total_price = db.Column(db.Float)
    order_time = db.Column(db.DateTime, server_default=db.func.now())


# 📦 ORDER ITEMS TABLE
class OrderItem(db.Model):
    __tablename__ = "order_items"

    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.Integer, db.ForeignKey("orders.id"))
    item_name = db.Column(db.String(100))
    quantity = db.Column(db.Integer)
    price = db.Column(db.Float)