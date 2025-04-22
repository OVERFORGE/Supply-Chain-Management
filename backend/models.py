class Supplier:
    def __init__(self, name, lat, lng, inventory):
        self.name = name
        self.lat = lat
        self.lng = lng
        self.inventory = inventory  

class Consumer:
    def __init__(self, name, lat, lng, demand):
        self.name = name
        self.lat = lat
        self.lng = lng
        self.demand = demand  
