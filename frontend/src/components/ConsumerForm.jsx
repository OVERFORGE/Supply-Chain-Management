import React, { useState } from "react";
import cities from "../data/cities";

const ConsumerForm = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [demand, setDemand] = useState("");

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

    if (!latitude || !longitude || !demand) {
      alert("Please complete all fields.");
      return;
    }

    const consumer = {
      name,
      city,
      lat: parseFloat(latitude),
      lng: parseFloat(longitude),
      demand: parseInt(demand),
    };

    onAdd(consumer);

    setName("");
    setCity("");
    setLatitude("");
    setLongitude("");
    setDemand("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-white rounded-lg shadow-md"
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
        <label className="block font-semibold">Demand</label>
        <input
          type="number"
          className="w-full border rounded p-2"
          value={demand}
          onChange={(e) => setDemand(e.target.value)}
          required
        />
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
