import React, { useEffect } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";

const MapView = ({ suppliers, consumers, routes }) => {
  useEffect(() => {
    const map = L.map("map").setView([28.6139, 77.209], 5); // India center

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // Plot supplier and consumer markers
    suppliers.forEach(({ lat, lng, name }) => {
      L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
          iconSize: [32, 32],
        }),
      })
        .addTo(map)
        .bindPopup(`Supplier: ${name}`);
    });

    consumers.forEach(({ lat, lng, name }) => {
      L.marker([lat, lng], {
        icon: L.icon({
          iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          iconSize: [32, 32],
        }),
      })
        .addTo(map)
        .bindPopup(`Consumer: ${name}`);
    });

    const drawRoutes = async () => {
      try {
        for (const [supplierName, consumerName] of routes) {
          const supplier = suppliers.find((s) => s.name === supplierName);
          const consumer = consumers.find((c) => c.name === consumerName);

          if (!supplier || !consumer) continue;

          const coordinates = [
            [supplier.lng, supplier.lat],
            [consumer.lng, consumer.lat],
          ];

          const response = await axios.post(
            "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
            { coordinates },
            {
              headers: {
                Authorization: import.meta.env.VITE_ORS_API_KEY,
                "Content-Type": "application/json",
              },
            }
          );

          const geoJson = L.geoJSON(response.data, {
            style: {
              color: "#00ff00",
              weight: 4,
              opacity: 0.7,
            },
          }).addTo(map);

          map.fitBounds(geoJson.getBounds());
        }
      } catch (err) {
        console.error("Error drawing routes:", err);
      }
    };

    if (routes.length > 0) {
      drawRoutes();
    }

    return () => map.remove(); // Cleanup map on unmount
  }, [suppliers, consumers, routes]);

  return <div id="map" className="h-[400px] w-8/12 m-auto rounded-lg" />;
};

export default MapView;
