"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getCityWeather } from "@/lib/weather-service";
import { WeatherCard } from "./weather-card";

const FEATURED_CITIES = [
  "Jakarta", "Surabaya", "Bandung", "Medan", "Makassar", "Yogyakarta"
];

export function FeaturedCities() {
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataSources, setDataSources] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const weatherPromises = FEATURED_CITIES.map(city => 
          getCityWeather(city)
        );
        const results = await Promise.all(weatherPromises);
        
        // Extract data sources
        const sources: Record<string, string> = {};
        results.forEach((result, index) => {
          sources[FEATURED_CITIES[index]] = result.dataSource || 'Unknown';
        });
        
        setWeatherData(results);
        setDataSources(sources);
        setError(null);
      } catch (err) {
        setError("Failed to load weather data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    
    fetchData();
  }, []);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="weather-card animate-pulse">
            <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
            <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-full mb-2"></div>
            <div className="h-8 w-16 bg-gray-200 dark:bg-gray-700 rounded mb-2"></div>
            <div className="h-4 w-36 bg-gray-200 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 text-sm text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {weatherData.map((cityData, index) => (
        <Link href={`/city/${encodeURIComponent(FEATURED_CITIES[index])}`} key={index}>
          <WeatherCard 
            city={FEATURED_CITIES[index]}
            temperature={cityData.main.temp} 
            condition={cityData.weather[0].main}
            icon={cityData.weather[0].icon}
            humidity={cityData.main.humidity}
            windSpeed={cityData.wind.speed}
            dataSource={dataSources[FEATURED_CITIES[index]]}
          />
        </Link>
      ))}
    </div>
  );
}
