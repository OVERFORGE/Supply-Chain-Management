import React from "react";

export default function Sidebar({
  suppliers,
  consumers,
  onDeleteSupplier,
  onDeleteConsumer,
}) {
  return (
    <div className="grid grid-cols-2 gap-4 w-8/12 m-auto mt-10 mb-10">
      <div>
        <h2 className="text-lg font-semibold mb-2 text-white">Suppliers</h2>
        <ul className="space-y-1">
          {suppliers.map((supplier, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{supplier.name}</span>
              <span>City:{supplier.city}</span>
              <span>Inventory: {supplier.inventory}</span>
              <button
                onClick={() => onDeleteSupplier(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2 text-white">Consumers</h2>
        <ul className="space-y-1">
          {consumers.map((consumer, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-100 p-2 rounded"
            >
              <span>{consumer.name}</span>
              <span>City: {consumer.city}</span>
              <span>Demand: {consumer.demand}</span>
              <button
                onClick={() => onDeleteConsumer(index)}
                className="text-red-500 hover:text-red-700"
              >
                ✖
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
