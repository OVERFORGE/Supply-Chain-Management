import React from "react";

const OptimizationLog = ({ routes }) => {
  console.log(routes);

  return (
    <div className="w-5/12 m-auto mt-10 p-6 bg-gray-800 text-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-center">
        📦 Optimization Log
      </h2>
      {routes ? (
        <ul className="space-y-4">
          {routes.map((route, index) => {
            const supplierLoc = Array.isArray(route.supplier_location)
              ? route.supplier_location.join(", ")
              : "N/A";

            const consumerLoc = Array.isArray(route.consumer_location)
              ? route.consumer_location.join(", ")
              : "N/A";

            return (
              <li key={index} className="bg-gray-700 p-4 rounded-lg shadow">
                <p>
                  <span className="font-semibold text-blue-400">Supplier:</span>{" "}
                  {route.supplier || "Unknown"}
                </p>
                <p>
                  <span className="font-semibold text-green-400">
                    Consumer:
                  </span>{" "}
                  {route.consumer || "Unknown"}
                </p>
                <p>
                  <span className="font-semibold text-yellow-400">
                    Product:
                  </span>{" "}
                  {route.product || "N/A"} — {route.quantity || "?"} units
                </p>
              </li>
            );
          })}
        </ul>
      ) : (
        <div>
          <p className="text-center text-white">
            No optimization data available.
          </p>
        </div>
      )}
    </div>
  );
};

export default OptimizationLog;
