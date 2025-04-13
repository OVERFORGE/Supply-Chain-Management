from flask import Blueprint, request, jsonify
from models import Supplier, Consumer  # ensure these classes are in models.py
from utils.distances import get_distance_matrix  # ensure this function is in utils/distances.py
from utils.aco import ACO  # ensure ACO class is in utils/aco.py

bp = Blueprint('supply_chain', __name__)

# In-memory lists to store suppliers and consumers
suppliers = []
consumers = []

@bp.route("/add_supplier", methods=["POST"])
def add_supplier():
    data = request.json
    name = data.get("name")
    lat = data.get("lat")
    lng = data.get("lng")
    inventory = data.get("inventory")  # Expected to be a dict: {product: quantity}

    if not all([name, lat, lng, inventory]):
        return jsonify({"error": "Missing supplier data"}), 400

    supplier = Supplier(name, lat, lng, inventory)
    suppliers.append(supplier)
    return jsonify({"message": "Supplier added successfully"}), 201

@bp.route("/add_consumer", methods=["POST"])
def add_consumer():
    data = request.json
    name = data.get("name")
    lat = data.get("lat")
    lng = data.get("lng")
    demand = data.get("demand")  # Expected to be a dict: {product: quantity}

    if not all([name, lat, lng, demand]):
        return jsonify({"error": "Missing consumer data"}), 400

    consumer = Consumer(name, lat, lng, demand)
    consumers.append(consumer)
    return jsonify({"message": "Consumer added successfully"}), 201

@bp.route("/optimize", methods=["POST"])
def optimize_routes():
    try:
        if not suppliers or not consumers:
            return jsonify({"error": "Suppliers or Consumers data is missing"}), 400

        distance_matrix = get_distance_matrix(suppliers, consumers)
        aco = ACO(suppliers, consumers, distance_matrix)
        best_solution, best_cost = aco.run()

        result = [
            {
                "supplier": s,
                "consumer": c,
                "product": p,
                "quantity": q
            }
            for (s, c, p, q) in best_solution
        ]

        return jsonify({
            "assignments": result,
            "total_cost": round(best_cost, 4)
        })
    except Exception as e:
        print("Optimization Error:", e)
        return jsonify({"error": str(e)}), 500
