import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import products from "../data/products"; // ✅ your product list

const supplierIcon = new L.Icon({
  iconUrl: "../../public/images/supplier_marker.png",
  iconSize: [30, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const consumerIcon = new L.Icon({
  iconUrl: "../../public/images/consumer_marker.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const ORS_API_KEY = "5b3ce3597851110001cf6248560da2d1267f4b5a9d295a5a19dd93dd";

const MapView = ({ suppliers, consumers, routes }) => {
  const [realRoutes, setRealRoutes] = useState([]);
  const [productColors, setProductColors] = useState({});

  const findSupplierByName = (name) => suppliers.find((s) => s.name === name);
  const findConsumerByName = (name) => consumers.find((c) => c.name === name);

  useEffect(() => {
    const generateColorMap = () => {
      const colors = {};
      products.forEach((product) => {
        const randomColor =
          "#" + Math.floor(Math.random() * 16777215).toString(16);
        colors[product] = randomColor;
      });
      setProductColors(colors);
    };

    generateColorMap();
  }, []);

  useEffect(() => {
    const fetchRoutes = async () => {
      const routePromises = routes.map(async (route) => {
        const supplier = findSupplierByName(route.supplier);
        const consumer = findConsumerByName(route.consumer);

        if (!supplier || !consumer) return null;

        try {
          const response = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            {
              coordinates: [
                [supplier.lng, supplier.lat],
                [consumer.lng, consumer.lat],
              ],
            },
            {
              headers: {
                Authorization: ORS_API_KEY,
                "Content-Type": "application/json",
              },
            }
          );

          const geometry = response.data.features[0].geometry.coordinates;
          const leafletCoords = geometry.map((coord) => [coord[1], coord[0]]);

          return {
            route: leafletCoords,
            product: route.product,
            quantity: route.quantity,
            supplier: route.supplier,
            consumer: route.consumer,
          };
        } catch (err) {
          console.error("Route fetch failed", err);
          return null;
        }
      });

      const resolvedRoutes = await Promise.all(routePromises);
      const filteredRoutes = resolvedRoutes.filter((r) => r !== null);
      setRealRoutes(filteredRoutes);
    };

    if (routes.length > 0) {
      fetchRoutes();
    }
  }, [routes, suppliers, consumers]);

  return (
    <div
      style={{ position: "relative" }}
      className="m-auto w-8/12 rounded-lg mt-10 mb-10"
    >
      <MapContainer
        center={[28.6139, 77.209]}
        zoom={6}
        style={{ height: "500px", width: "100%" }}
        className="rounded-lg shadow-lg"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {suppliers.map((s, idx) => (
          <Marker
            key={`s-${idx}`}
            position={[s.lat, s.lng]}
            icon={supplierIcon}
          >
            <Popup>Supplier: {s.name}</Popup>
          </Marker>
        ))}

        {consumers.map((c, idx) => (
          <Marker
            key={`c-${idx}`}
            position={[c.lat, c.lng]}
            icon={consumerIcon}
          >
            <Popup>Consumer: {c.name}</Popup>
          </Marker>
        ))}

        {realRoutes.map((route, index) => (
          <Polyline
            key={index}
            positions={route.route}
            color={productColors[route.product] || "blue"}
            weight={4}
          >
            <Popup>
              {route.supplier} ➡ {route.consumer}
              <br />
              {route.product} – Qty: {route.quantity}
            </Popup>
          </Polyline>
        ))}
      </MapContainer>

      <div
        style={{
          position: "absolute",
          top: 10,
          right: 10,
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "8px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          maxHeight: "90%",
          overflowY: "auto",
          zIndex: 1000,
        }}
      >
        <h4 style={{ marginBottom: "8px", fontWeight: "bold" }}>Legend</h4>
        {Object.entries(productColors).map(([product, color]) => (
          <div
            key={product}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "6px",
            }}
          >
            <div
              style={{
                width: "15px",
                height: "15px",
                backgroundColor: color,
                marginRight: "8px",
                borderRadius: "4px",
              }}
            />
            <span>{product}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MapView;
