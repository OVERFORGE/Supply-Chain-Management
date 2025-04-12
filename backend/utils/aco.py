import random
import math
import certifi
class ACO:
    def __init__(self, suppliers, consumers, distance_matrix, alpha=1.0, beta=2.0, evaporation=0.5, ants=10, iterations=50):
        self.suppliers = suppliers
        self.consumers = consumers
        self.distance_matrix = distance_matrix
        self.pheromone = [[1.0 for _ in consumers] for _ in suppliers]
        self.alpha = alpha
        self.beta = beta
        self.evaporation = evaporation
        self.ants = ants
        self.iterations = iterations

    def run(self):
        best_solution = None
        best_cost = float('inf')

        for _ in range(self.iterations):
            all_solutions = [self.construct_solution() for _ in range(self.ants)]
            all_costs = [self.evaluate_solution(sol) for sol in all_solutions]

            best_idx = all_costs.index(min(all_costs))
            if all_costs[best_idx] < best_cost:
                best_cost = all_costs[best_idx]
                best_solution = all_solutions[best_idx]

            self.update_pheromones(all_solutions, all_costs)

        return best_solution, best_cost

    def construct_solution(self):
        unassigned_consumers = set(range(len(self.consumers)))
        available_suppliers = list(range(len(self.suppliers)))
        solution = []

        while unassigned_consumers:
            candidate_pairs = []

            for i in available_suppliers:
                for j in unassigned_consumers:
                    pher = self.pheromone[i][j] ** self.alpha
                    heuristic = (1 / self.distance_matrix[i][j]) ** self.beta
                    score = pher * heuristic
                    candidate_pairs.append(((i, j), score))

            if not candidate_pairs:
                break

            # Normalize probabilities
            total_score = sum(score for _, score in candidate_pairs)
            probabilities = [score / total_score for _, score in candidate_pairs]

            selected_index = self.roulette_wheel_selection(probabilities)
            (i, j) = candidate_pairs[selected_index][0]

            # Assign supplier i to consumer j
            solution.append((self.suppliers[i].name, self.consumers[j].name))
            unassigned_consumers.remove(j)

        return solution


    def roulette_wheel_selection(self, probabilities):
        r = random.random()
        cumulative = 0.0
        for index, prob in enumerate(probabilities):
            cumulative += prob
            if r < cumulative:
                return index
        return None

    def evaluate_solution(self, solution):
        cost = 0
        for s_name, c_name in solution:
            s_idx = [s.name for s in self.suppliers].index(s_name)
            c_idx = [c.name for c in self.consumers].index(c_name)
            cost += self.distance_matrix[s_idx][c_idx]
        return cost

    def update_pheromones(self, solutions, costs):
        # Evaporate
        for i in range(len(self.suppliers)):
            for j in range(len(self.consumers)):
                self.pheromone[i][j] *= (1 - self.evaporation)

        # Add new pheromone
        for solution, cost in zip(solutions, costs):
            if cost == 0:
                continue
            for s_name, c_name in solution:
                i = [s.name for s in self.suppliers].index(s_name)
                j = [c.name for c in self.consumers].index(c_name)
                self.pheromone[i][j] += 1.0 / cost
