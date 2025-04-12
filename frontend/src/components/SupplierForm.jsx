import React, { useState } from "react";
import cities from "../data/cities";

const SupplierForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [inventory, setInventory] = useState("");
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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Only add if coords are available
    if (!latitude || !longitude || !inventory) {
      alert("Please complete all fields.");
      return;
    }

    const supplier = {
      name,
      city,
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      inventory: parseInt(inventory),
    };

    onAdd(supplier);

    setName("");
    setCity("");
    setLatitude("");
    setLongitude("");
    setInventory("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-lg shadow-md "
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
          className="w-full border rounded p-2"
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

      <div>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={latitude}
          readOnly
          hidden
        />
      </div>

      <div>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={longitude}
          readOnly
          hidden
        />
      </div>
      <div>
        <label className="block font-semibold">Inventory</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={inventory}
          onChange={(e) => setInventory(e.target.value)}
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Supplier
      </button>
    </form>
  );
};

export default SupplierForm;
