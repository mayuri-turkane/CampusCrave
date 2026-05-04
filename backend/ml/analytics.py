import pandas as pd
from datetime import datetime, timedelta
from collections import Counter

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder

from models import Order, OrderItem


class CampusCraveAnalytics:

    def __init__(self):
        self.model = RandomForestRegressor(n_estimators=20, random_state=42)
        self.encoder = LabelEncoder()

    # -----------------------------
    # LOAD DATA FROM DB
    # -----------------------------
    def load_data(self):
        orders = Order.query.all()
        order_items = OrderItem.query.all()

        if not orders or not order_items:
            return pd.DataFrame()

        order_map = {o.id: o for o in orders}

        data = []
        for oi in order_items:
            order = order_map.get(oi.order_id)
            if not order:
                continue

            data.append({
                "item_name": oi.item_name,
                "quantity": oi.quantity,
                "order_time": order.order_time,
                "group_id": order.group_id
            })

        df = pd.DataFrame(data)

        if df.empty:
            return df

        df["order_time"] = pd.to_datetime(df["order_time"])
        df["hour"] = df["order_time"].dt.hour
        df["day"] = df["order_time"].dt.dayofweek

        return df

    # -----------------------------
    # INVENTORY PREDICTION
    # -----------------------------
    def predict_inventory(self, df):
        if df.empty or len(df) < 5:
            return {}

        df["item_encoded"] = self.encoder.fit_transform(df["item_name"])

        X = df[["item_encoded", "hour", "day"]]
        y = df["quantity"]

        self.model.fit(X, y)

        predictions = {}
        now = datetime.now()

        for item in df["item_name"].unique():
            enc = self.encoder.transform([item])[0]

            total = 0
            for i in range(4):
                future = now + timedelta(hours=i)

                pred = self.model.predict([[
                    enc,
                    future.hour,
                    future.weekday()
                ]])[0]

                total += max(0, int(pred))

            predictions[item] = total

        return predictions

    # -----------------------------
    # TRENDING ITEMS
    # -----------------------------
    def trending_items(self, df, predictions):
        if df.empty:
            return {}

        last_hour = datetime.now() - timedelta(minutes=60)
        recent = df[df["order_time"] >= last_hour]

        counts = recent["item_name"].value_counts().to_dict()

        result = {}
        for item in df["item_name"].unique():
            result[item] = {
                "trending": counts.get(item, 0) >= 1,
                "selling_fast": predictions.get(item, 0) >= 5
            }

        return result

    # -----------------------------
    # SQUAD COMBOS
    # -----------------------------
    def squad_recommendations(self, df):
        if df.empty:
            return []

        group_df = df[df["group_id"].notnull()]
        if group_df.empty:
            return []

        grouped = group_df.groupby("group_id")["item_name"].apply(list)

        counter = Counter()
        for items in grouped:
            if len(items) >= 2:
                combo = tuple(sorted(items))
                counter[combo] += 1

        return [{"combo": list(c)} for c, _ in counter.most_common(5)]

    # -----------------------------
    # MAIN FUNCTION
    # -----------------------------
    def run(self):
        df = self.load_data()

        if df.empty:
            return {
                "hot_labels": {},
                "squad_recommendations": [],
                "inventory_prediction": {}
            }

        predictions = self.predict_inventory(df)
        hot = self.trending_items(df, predictions)
        combos = self.squad_recommendations(df)

        return {
            "hot_labels": hot,
            "squad_recommendations": combos,
            "inventory_prediction": predictions
        }