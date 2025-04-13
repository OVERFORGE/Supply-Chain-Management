import React from "react";

const Sidebar = ({
  suppliers,
  consumers,
  onDeleteSupplier,
  onDeleteConsumer,
}) => {
  return (
    <div className="w-10/12 bg-gray-800 text-white p-4 rounded-lg shadow-lg m-auto flex gap-10">
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-3">Suppliers</h2>
        <ul>
          {suppliers.map((supplier, index) => (
            <li
              key={index}
              className="flex justify-between  bg-gray-700 p-4 rounded-lg shadow mb-2 "
            >
              <span className="font-semibold">{supplier.name}</span>
              {/* <span className="font-semibold">{supplier.location}</span> */}
              <div>
                <h3 className="font-semibold">Inventory:</h3>
                <ul>
                  {Object.entries(supplier.inventory).map(
                    ([product, quantity]) => (
                      <li key={product}>
                        {product}: {quantity}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <button
                onClick={() => onDeleteSupplier(index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-semibold mb-3">Consumers</h2>
        <ul>
          {consumers.map((consumer, index) => (
            <li
              key={index}
              className="flex justify-between bg-gray-700 p-4 rounded-lg shadow mb-2"
            >
              <span className="align-text-top">{consumer.name}</span>
              <div>
                <h3>Demand:</h3>
                <ul>
                  {Object.entries(consumer.demand).map(
                    ([product, quantity]) => (
                      <li key={product}>
                        {product}: {quantity}
                      </li>
                    )
                  )}
                </ul>
              </div>
              <button
                onClick={() => onDeleteConsumer(index)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
