from geopy.distance import geodesic

def get_distance_matrix(suppliers, consumers):
    return [
        [geodesic((s.lat, s.lng), (c.lat, c.lng)).km for c in consumers]
        for s in suppliers
    ]
