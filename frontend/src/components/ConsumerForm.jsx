import React, { useState } from "react";
import cities from "../data/cities";
import products from "../data/products";

const ConsumerForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [demandProduct, setDemandProduct] = useState("");
  const [demandQuantity, setDemandQuantity] = useState("");
  const [demand, setDemand] = useState({});

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

  const handleAddDemand = () => {
    if (demandProduct && demandQuantity) {
      setDemand((prevDemand) => ({
        ...prevDemand,
        [demandProduct]: parseInt(demandQuantity),
      }));
      setDemandProduct("");
      setDemandQuantity("");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!latitude || !longitude || Object.keys(demand).length === 0) {
      alert("Please complete all fields.");
      return;
    }

    const consumer = {
      name,
      city,
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      demand,
    };

    onAdd(consumer);

    setName("");
    setCity("");
    setLatitude("");
    setLongitude("");
    setDemand({});
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-gray-800 text-white rounded-lg shadow-md"
    >
      <div>
        <label className="block font-semibold">Consumer Name</label>
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
        <label className="block font-semibold">Product Demand</label>
        <select
          className="w-full border rounded p-2 bg-gray-800"
          value={demandProduct}
          onChange={(e) => setDemandProduct(e.target.value)}
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
          value={demandQuantity}
          onChange={(e) => setDemandQuantity(e.target.value)}
        />
      </div>

      <button
        type="button"
        className="bg-yellow-600 text-white px-4 py-2 rounded"
        onClick={handleAddDemand}
      >
        Add Demand
      </button>

      <div>
        <h3>Current Demand:</h3>
        <ul>
          {Object.entries(demand).map(([product, quantity]) => (
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
        Add Consumer
      </button>
    </form>
  );
};

export default ConsumerForm;
