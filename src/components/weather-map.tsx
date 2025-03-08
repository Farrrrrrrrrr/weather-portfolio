"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCityWeather } from "@/lib/weather-service";
import { ArrowRightIcon } from "@heroicons/react/outline";

// Major Indonesian cities with their coordinates
const INDONESIAN_CITIES = [
  { name: "Jakarta", lat: -6.2088, lng: 106.8456 },
  { name: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { name: "Bandung", lat: -6.9175, lng: 107.6191 },
  { name: "Medan", lat: 3.5952, lng: 98.6722 },
  { name: "Makassar", lat: -5.1477, lng: 119.4327 },
  { name: "Yogyakarta", lat: -7.7956, lng: 110.3695 },
];

export function WeatherMap() {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataSources, setDataSources] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadWeatherData() {
      try {
        const cityNames = INDONESIAN_CITIES.map(city => city.name);
        const weatherPromises = cityNames.map(city => getCityWeather(city));
        const results = await Promise.all(weatherPromises);
        
        // Track data sources
        const sources: Record<string, string> = {};
        results.forEach((result, index) => {
          sources[cityNames[index]] = result.dataSource || 'Unknown';
        });
        
        setWeatherData(results);
        setDataSources(sources);
      } catch (error) {
        console.error("Error fetching weather data:", error);
      } finally {
        setLoading(false);
      }
    }

    loadWeatherData();
  }, []);

  return (
    <div className="h-full w-full bg-gray-100 dark:bg-gray-800 rounded-lg p-6 flex flex-col">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="animate-pulse text-gray-600 dark:text-gray-400">Loading weather data...</div>
        </div>
      ) : (
        <>
          <div className="flex-grow">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {INDONESIAN_CITIES.map((city) => {
                const cityWeather = weatherData.find(
                  data => data?.name?.toLowerCase() === city.name.toLowerCase()
                );
                
                if (!cityWeather) return null;
                
                return (
                  <div key={city.name} className="bg-white dark:bg-gray-900 p-3 rounded-md shadow-sm">
                    <h3 className="font-medium">{city.name}</h3>
                    <div className="text-lg font-bold">{Math.round(cityWeather.main.temp)}°C</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">{cityWeather.weather[0].description}</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          <Link href="/map" className="mt-6 flex items-center justify-center bg-primary text-white py-3 px-4 rounded-md hover:bg-primary/90 transition-colors">
            <span>View Interactive Map</span>
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </Link>
        </>
      )}
    </div>
  );
}
