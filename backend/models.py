class Supplier:
    def __init__(self, name, lat, lng, inventory):
        self.name = name
        self.lat = lat
        self.lng = lng
        self.inventory = inventory  # dict: { "product_name": quantity }

class Consumer:
    def __init__(self, name, lat, lng, demand):
        self.name = name
        self.lat = lat
        self.lng = lng
        self.demand = demand  # dict: { "product_name": quantity }
