import React, { useState } from "react";
import cities from "../data/cities";
import products from "../data/products";

const SupplierForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [inventory, setInventory] = useState({});

  const handleCityChange = (e) => {
    const selectedCity = cities.find((c) => c.name === e.target.value);
    if (selectedCity) {
      setCity(selectedCity.name);
      setLatitude(selectedCity.lat);
      setLongitude(selectedCity.lng);
    } else {
      setCity("");
      setLatitude("");
      setLongitude("");
    }
  };

  const handleAddInventory = () => {
    if (selectedProduct && productQuantity) {
      setInventory((prev) => ({
        ...prev,
        [selectedProduct]: parseInt(productQuantity),
      }));
      setSelectedProduct("");
      setProductQuantity("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!latitude || !longitude || Object.keys(inventory).length === 0) {
      alert("Please complete all fields.");
      return;
    }

    const supplier = {
      name,
      city,
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      inventory,
    };

    onAdd(supplier);

    setName("");
    setCity("");
    setLatitude("");
    setLongitude("");
    setInventory({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-gray-800 text-white rounded-lg shadow-md"
    >
      <div>
        <label className="block font-semibold">Supplier Name</label>
        <input
          type="text"
          className="w-full border rounded p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div>
        <label className="block font-semibold">City</label>
        <select
          className="w-full border rounded p-2 bg-gray-800"
          value={city}
          onChange={handleCityChange}
          required
        >
          <option value="">Select a city</option>
          {cities.map((city) => (
            <option key={city.name} value={city.name}>
              {city.name}
            </option>
          ))}
        </select>
      </div>

      <div className="hidden">
        <input type="number" value={latitude} readOnly />
        <input type="number" value={longitude} readOnly />
      </div>

      <div>
        <label className="block font-semibold">Product Inventory</label>
        <select
          className="w-full border rounded p-2 bg-gray-800"
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
        >
          <option value="">Select a product</option>
          {products.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </select>
      </div>

      <div>
        <input
          type="number"
          className="w-full border rounded p-2"
          placeholder="Quantity"
          value={productQuantity}
          onChange={(e) => setProductQuantity(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="bg-yellow-600 text-white px-4 py-2 rounded"
        onClick={handleAddInventory}
      >
        Add Inventory
      </button>

      <div>
        <h3>Current Inventory:</h3>
        <ul>
          {Object.entries(inventory).map(([product, quantity]) => (
            <li key={product}>
              {product}: {quantity}
            </li>
          ))}
        </ul>
      </div>

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Add Supplier
      </button>
    </form>
  );
};

export default SupplierForm;
