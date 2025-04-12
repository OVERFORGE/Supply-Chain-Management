import { useState } from "react";
import SupplierForm from "./components/SupplierForm";
import ConsumerForm from "./components/ConsumerForm";
import MapView from "./components/MapView";
import Sidebar from "./components/Sidebar";
import { Toaster, toast } from "react-hot-toast";

function App() {
  const [suppliers, setSuppliers] = useState([]);
  const [consumers, setConsumers] = useState([]);
  const [routes, setRoutes] = useState([]);

  const handleAddSupplier = async (supplier) => {
    try {
      await fetch("http://localhost:5000/add_supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplier),
      });
      console.log("Supplier data:", supplier);
      setSuppliers([...suppliers, supplier]);
      toast.success("Supplier added successfully!");
    } catch (err) {
      toast.error("Failed to add supplier");
    }
  };

  const handleAddConsumer = async (consumer) => {
    try {
      await fetch("http://localhost:5000/add_consumer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(consumer),
      });
      setConsumers([...consumers, consumer]);
      toast.success("Consumer added successfully!");
    } catch (err) {
      toast.error("Failed to add consumer");
    }
  };

  const handleDeleteSupplier = async (index) => {
    const name = suppliers[index].name;
    try {
      const res = await fetch("http://localhost:5000/delete_supplier", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to delete supplier");

      setSuppliers((prev) => prev.filter((_, i) => i !== index));
      toast.success(`Deleted supplier '${name}'`);
    } catch (err) {
      toast.error("Error deleting supplier");
    }
  };

  const handleDeleteConsumer = async (index) => {
    const name = consumers[index].name;
    try {
      const res = await fetch("http://localhost:5000/delete_consumer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) throw new Error("Failed to delete consumer");

      setConsumers((prev) => prev.filter((_, i) => i !== index));
      toast.success(`Deleted consumer '${name}'`);
    } catch (err) {
      toast.error("Error deleting consumer");
    }
  };

  const handleOptimize = async () => {
    try {
      const res = await fetch("http://localhost:5000/optimize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }

      const data = await res.json();
      setRoutes(data.routes);

      console.log("✅ Optimized Routes:", data.routes);
      toast.success(
        `✅ Optimization complete! ${data.routes.length} routes found.`
      );
    } catch (error) {
      console.error("❌ Optimization failed:", error);
      toast.error("❌ Optimization failed. Please try again.");
    }
  };

  return (
    <div className="p-4 space-y-4 bg-zinc-900">
      <h1 className="text-5xl font-bold text-center text-white mb-20">
        Supply Chain ACO Optimizer
      </h1>
      <div className="grid grid-cols-2 gap-4 w-8/12 m-auto">
        <SupplierForm onAdd={handleAddSupplier} />
        <ConsumerForm onAdd={handleAddConsumer} />
      </div>
      <div className="mt-10 w-full flex justify-center mb-10">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded m-auto"
          onClick={handleOptimize}
        >
          Optimize Supply Chain
        </button>
      </div>

      <Sidebar
        suppliers={suppliers}
        consumers={consumers}
        onDeleteSupplier={handleDeleteSupplier}
        onDeleteConsumer={handleDeleteConsumer}
      />
      <MapView suppliers={suppliers} consumers={consumers} routes={routes} />
    </div>
  );
}

export default App;
