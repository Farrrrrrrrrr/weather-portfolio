"use client";

import { useState, useEffect } from "react";
import { fetchMultipleCityWeather } from "@/lib/api";
import dynamic from "next/dynamic";

// Indonesian cities with their coordinates
const INDONESIAN_CITIES = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Medan", lat: 3.5952, lng: 98.6722 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
  { name: "Denpasar", lat: -8.6705, lng: 115.2126 },
  { name: "Palembang", lat: -2.9761, lng: 104.7754 },
  { name: "Manado", lat: 1.4748, lng: 124.8421 },
  { name: "Jayapura", lat: -2.5916, lng: 140.6690 },
  // Add more cities for a comprehensive map
  { name: "Padang", lat: -0.9471, lng: 100.4172 },
  { name: "Pontianak", lat: 0.0263, lng: 109.3425 },
  { name: "Balikpapan", lat: -1.2379, lng: 116.8529 },
  { name: "Banjarmasin", lat: -3.3186, lng: 114.5944 },
  { name: "Semarang", lat: -6.9932, lng: 110.4203 },
];

// Use a different component entirely to avoid conflicts
const MapComponent = dynamic(
  () => import("@/components/map-page-view").then(mod => mod.MapPageView),
  {
    ssr: false,
    loading: () => (
      <div className="h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg">
        <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading weather map...</div>
      </div>
    )
  }
);

export default function MapPage() {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWeatherData() {
      try {
        const cityNames = INDONESIAN_CITIES.map(city => city.name);
        const data = await fetchMultipleCityWeather(cityNames);
        setWeatherData(data);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWeatherData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Indonesia Weather Map</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Interactive map showing real-time weather conditions across major Indonesian cities
        </p>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden h-[70vh]">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading weather data...</div>
          </div>
        ) : (
          <MapComponent cities={INDONESIAN_CITIES} weatherData={weatherData} />
        )}
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">About Indonesia's Geography</h2>
        <div className="prose dark:prose-invert max-w-none">
          <p>
            Indonesia is the world's largest archipelago, consisting of more than 17,000 islands spanning across the 
            equator between the Indian and Pacific Oceans. The country's geography creates diverse climate patterns
            across different regions.
          </p>
          <p className="mt-4">
            The western islands (Java, Sumatra) often experience more rainfall, while eastern regions like Papua may 
            have different weather patterns. Indonesia has a tropical climate with two main seasons: the dry season 
            (May to October) and the rainy season (November to April).
          </p>
        </div>
      </div>
    </div>
  );
}
