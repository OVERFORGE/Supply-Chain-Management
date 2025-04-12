from flask import Blueprint, request, jsonify
from models import Supplier, Consumer
from utils.aco import ACO
import requests
import certifi
bp = Blueprint("supply_chain_api", __name__)
ORS_API_KEY = "5b3ce3597851110001cf6248560da2d1267f4b5a9d295a5a19dd93dd"

# Dummy in-memory storage (replace with DB later)
suppliers = []
consumers = []

# ====== UTILITY FUNCTIONS ======

def get_distance(source, destination):
    import certifi
    url = "https://api.openrouteservice.org/v2/directions/driving-car"
    headers = {
        "Authorization": ORS_API_KEY,
        "Content-Type": "application/json"
    }
    body = {
        "coordinates": [
            [source["lng"], source["lat"]],
            [destination["lng"], destination["lat"]]
        ]
    }
    response = requests.post(url, json=body, headers=headers, verify=certifi.where())
    if response.status_code == 200:
        data = response.json()
        try:
            distance = data["routes"][0]["summary"]["distance"]
            return distance / 1000
        except (KeyError, IndexError):
            return float("inf")
    else:
        return float("inf")


def get_distance_matrix(suppliers, consumers):
    matrix = []
    for s in suppliers:
        row = []
        for c in consumers:
            print(f"Getting distance from {s.name} ({s.lat}, {s.lng}) to {c.name} ({c.lat}, {c.lng})")
            distance = get_distance(
                {"lat": s.lat, "lng": s.lng},
                {"lat": c.lat, "lng": c.lng}
            )
            print(f"Distance from {s.name} to {c.name} = {distance} km")
            row.append(distance)
        matrix.append(row)

    if any(float("inf") in row for row in matrix):
        print("❌ One or more distances returned 'inf'. Full matrix:")
        for r in matrix:
            print(r)
        raise ValueError("Failed to retrieve valid distances from ORS API. Check coordinates or API limits.")

    return matrix

# ====== ROUTES ======

@bp.route("/add_supplier", methods=["POST"])
def add_supplier():
    data = request.json
    name = data.get("name")
    lat = data.get("lat")
    lng = data.get("lng")
    inventory = data.get("inventory")

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
    demand = data.get("demand")

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

        print("Suppliers:", [(s.name, s.lat, s.lng) for s in suppliers])
        print("Consumers:", [(c.name, c.lat, c.lng) for c in consumers])

        distance_matrix = get_distance_matrix(suppliers, consumers)
        print("Distance matrix:", distance_matrix)

        from utils.aco import ACO
        aco = ACO(suppliers, consumers, distance_matrix)
        best_solution, best_cost = aco.run()

        print("Best solution:", best_solution)
        print("Best cost:", best_cost)

        return jsonify({
            "routes": best_solution,
            "total_cost": round(best_cost, 4)
        })
    except Exception as e:
        print("Optimization Error:", e)
        return jsonify({"error": str(e)}), 500

    

@bp.route('/delete_supplier', methods=['POST'])
def delete_supplier():
    data = request.get_json()
    name = data.get('name')
    global suppliers
    suppliers = [s for s in suppliers if s.name != name]  # <-- FIXED HERE
    return jsonify({"message": f"Supplier '{name}' deleted successfully"}), 200

@bp.route('/delete_consumer', methods=['POST'])
def delete_consumer():
    data = request.get_json()
    name = data.get('name')
    global consumers
    consumers = [c for c in consumers if c.name != name]  # <-- FIXED HERE
    return jsonify({"message": f"Consumer '{name}' deleted successfully"}), 200

