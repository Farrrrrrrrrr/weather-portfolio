"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix leaflet icons issue in Next.js
const fixLeafletIcon = () => {
  if (typeof window !== 'undefined') {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: '/marker-icon-2x.png',
      iconUrl: '/marker-icon.png',
      shadowUrl: '/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
  }
};

interface MapPageViewProps {
  cities: Array<{name: string; lat: number; lng: number}>;
  weatherData: any[];
}

export function MapPageView({ cities, weatherData }: MapPageViewProps) {
  const [isClient, setIsClient] = useState(false);
  const [mapId] = useState(`map-${Date.now()}`); // Generate unique ID

  useEffect(() => {
    setIsClient(true);
    fixLeafletIcon();
  }, []);
  
  if (!isClient) {
    return (
      <div className="h-full w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading map...</div>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full" id={mapId}>
      <MapContainer 
        center={[-2.5489, 118.0149]} // Center of Indonesia
        zoom={5} 
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {cities.map((city) => {
          const cityWeather = weatherData.find(
            data => data?.name?.toLowerCase() === city.name.toLowerCase()
          );
          
          return cityWeather ? (
            <Marker 
              key={city.name} 
              position={[city.lat, city.lng]} 
            >
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold">{city.name}</h3>
                  <p className="text-lg">{Math.round(cityWeather.main.temp)}°C</p>
                  <p>{cityWeather.weather[0].description}</p>
                  <p>Humidity: {cityWeather.main.humidity}%</p>
                  <p>Wind: {cityWeather.wind.speed} m/s</p>
                </div>
              </Popup>
            </Marker>
          ) : null;
        })}
      </MapContainer>
    </div>
  );
}
