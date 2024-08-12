import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import carIcon from "./R.png";

const carIconStyle = L.icon({
  iconUrl: carIcon,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const Map = () => {
  const [vehicleCoords, setVehicleCoords] = useState([0, 0]);
  const [vehicleRoute, setVehicleRoute] = useState([]);

  useEffect(() => {
    const fetchVehicleData = async () => {
      try {
        const response = await fetch("http://localhost:6540/api/vehicle");
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setVehicleCoords([data.currentPosition.lat, data.currentPosition.lng]);
        setVehicleRoute(data.route.map((point) => [point.lat, point.lng]));
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchVehicleData();
    const intervalId = setInterval(fetchVehicleData, 2000); // Update every 2 seconds

    return () => clearInterval(intervalId);
  }, []);

  const routeStyle = {
    color: "blue",
    weight: 5,
    opacity: 0.7,
  };

  return (
    <MapContainer
      center={vehicleCoords}
      zoom={13}
      style={{ height: "400px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={vehicleCoords} icon={carIconStyle} />
      <Polyline positions={vehicleRoute} pathOptions={routeStyle} />
    </MapContainer>
  );
};

export default Map;
