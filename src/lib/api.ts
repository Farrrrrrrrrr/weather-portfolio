import axios from "axios";
import { getBMKGWeatherByCity, parseBMKGWeatherData, INDONESIAN_CITY_CODES } from "./bmkg-api";

const BASE_URL = "https://api.openweathermap.org/data/2.5";
// Use NEXT_PUBLIC_ prefix for client-side access
const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;

// For development: mock data when API key is not available
const USE_MOCK_DATA = !API_KEY || API_KEY === 'your_openweathermap_api_key_here';
// Flag to determine whether to use BMKG for Indonesian cities
const USE_BMKG_FOR_INDONESIA = true;

/**
 * Fetch weather data for a specific city
 */
export async function fetchCityWeather(city: string) {
  // For Indonesian cities, try to use BMKG API first if enabled
  if (USE_BMKG_FOR_INDONESIA && INDONESIAN_CITY_CODES[city.toLowerCase()]) {
    try {
      const bmkgData = await getBMKGWeatherByCity(city);
      return parseBMKGWeatherData(bmkgData);
    } catch (error) {
      console.warn(`Failed to fetch from BMKG for ${city}, falling back to OpenWeatherMap:`, error);
      // Fall back to OpenWeatherMap or mock data
    }
  }
  
  if (USE_MOCK_DATA) {
    return getMockWeatherData(city);
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: `${city},id`, // 'id' is the country code for Indonesia
        units: "metric",
        appid: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching weather for ${city}:`, error);
    // Fallback to mock data if API request fails
    return getMockWeatherData(city);
  }
}

/**
 * Fetch weather data for multiple cities
 */
export async function fetchMultipleCityWeather(cities: string[]) {
  if (USE_MOCK_DATA) {
    return cities.map(city => getMockWeatherData(city));
  }
  
  try {
    const requests = cities.map(city => fetchCityWeather(city));
    const responses = await Promise.allSettled(requests);
    
    // Filter out any rejected promises and return only successful responses
    return responses
      .filter((result): result is PromiseFulfilledResult<any> => result.status === "fulfilled")
      .map(result => result.value);
  } catch (error) {
    console.error("Error fetching multiple city weather:", error);
    // Fallback to mock data if API request fails
    return cities.map(city => getMockWeatherData(city));
  }
}

/**
 * Fetch 5-day forecast for a specific city
 */
export async function fetchCityForecast(city: string) {
  if (USE_MOCK_DATA) {
    return getMockForecastData(city);
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: `${city},id`,
        units: "metric",
        appid: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching forecast for ${city}:`, error);
    // Fallback to mock data if API request fails
    return getMockForecastData(city);
  }
}

/**
 * Fetch air quality data for a location
 */
export async function fetchAirQuality(lat: number, lon: number) {
  if (USE_MOCK_DATA) {
    return getMockAirQualityData();
  }
  
  try {
    const response = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    });
    
    return response.data;
  } catch (error) {
    console.error(`Error fetching air quality for coordinates (${lat}, ${lon}):`, error);
    // Fallback to mock data if API request fails
    return getMockAirQualityData();
  }
}

/**
 * Fetch historical weather data
 */
export async function fetchHistoricalWeather(city: string, timestamp: number) {
  // Note: Historical data might require a different API endpoint or a paid plan
  // For demo purposes, we'll use mock data
  return {
    city,
    timestamp,
    temperature: 25 + Math.random() * 10,
    humidity: 50 + Math.random() * 30,
    windSpeed: 2 + Math.random() * 8,
    condition: "Clear",
  };
}

/**
 * Fetch weather alerts
 */
export async function fetchWeatherAlerts() {
  // For demo purposes, we'll provide mock data
  // In a real app, you would fetch from a real API
  const mockAlerts = [
    {
      id: 1,
      city: "Jakarta",
      type: "Heavy Rain Warning",
      severity: "moderate" as const,
      message: "Heavy rainfall expected in Jakarta over the next 24 hours. Possible flooding in low-lying areas.",
      date: new Date().toLocaleDateString()
    },
    {
      id: 2,
      city: "Bali",
      type: "High Surf Advisory",
      severity: "moderate" as const,
      message: "Strong waves of 2-3 meters expected on the southern beaches of Bali.",
      date: new Date().toLocaleDateString()
    },
    {
      id: 3,
      city: "Surabaya",
      type: "Extreme Heat Warning",
      severity: "severe" as const,
      message: "Temperatures expected to reach 38°C. Stay hydrated and avoid outdoor activities during peak hours.",
      date: new Date().toLocaleDateString()
    },

    {
        id: 4,
        city: "Everywhere",
        type: "ATTENTION",
        severity: "severe" as const,
        message: "Semua warning card di sini adalah buatan dan rekayasa semata, hehe.",
        date: new Date().toLocaleDateString()
      }
  ];
  
  return mockAlerts;
}

/**
 * Get coordinates for Indonesian cities
 */
export function getIndonesianCityCoordinates(cityName: string) {
  const cities: Record<string, {lat: number; lng: number}> = {
    "jakarta": { lat: -6.2088, lng: 106.8456 },
    "surabaya": { lat: -7.2575, lng: 112.7521 },
    "bandung": { lat: -6.9175, lng: 107.6191 },
    "medan": { lat: 3.5952, lng: 98.6722 },
    "makassar": { lat: -5.1477, lng: 119.4327 },
    "yogyakarta": { lat: -7.7956, lng: 110.3695 },
    "denpasar": { lat: -8.6705, lng: 115.2126 },
    "palembang": { lat: -2.9761, lng: 104.7754 },
    "manado": { lat: 1.4748, lng: 124.8421 },
    "jayapura": { lat: -2.5916, lng: 140.6690 },
    // Add more cities as needed
  };
  
  return cities[cityName.toLowerCase()] || null;
}

// Mock data functions
function getMockWeatherData(city: string) {
  const coords = getIndonesianCityCoordinates(city.toLowerCase()) || { lat: -6.2, lng: 106.8 }; // Default to Jakarta
  
  // Generate random temperatures based on Indonesian climate (typically 24-33°C)
  const temp = 24 + Math.random() * 9;
  const feels_like = temp - 1 + Math.random() * 2;
  
  // Choose a random weather condition (common in Indonesia)
  const conditions = [
    { main: "Clear", description: "clear sky", icon: "01d" },
    { main: "Clouds", description: "scattered clouds", icon: "03d" },
    { main: "Rain", description: "light rain", icon: "10d" },
    { main: "Rain", description: "moderate rain", icon: "10d" },
    { main: "Thunderstorm", description: "thunderstorm", icon: "11d" }
  ];
  const weatherCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  return {
    name: city,
    coord: {
      lat: coords.lat,
      lon: coords.lng
    },
    weather: [weatherCondition],
    main: {
      temp: temp,
      feels_like: feels_like,
      temp_min: temp - 2,
      temp_max: temp + 2,
      pressure: 1008 + Math.floor(Math.random() * 10),
      humidity: 70 + Math.floor(Math.random() * 20)
    },
    visibility: 8000 + Math.floor(Math.random() * 2000),
    wind: {
      speed: 1 + Math.random() * 5,
      deg: Math.floor(Math.random() * 360)
    },
    clouds: {
      all: Math.floor(Math.random() * 100)
    },
    sys: {
      sunrise: Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
      sunset: Math.floor(Date.now() / 1000) + 21600 // 6 hours from now
    },
    timezone: 25200, // UTC+7 for Western Indonesian Time
    id: Math.floor(Math.random() * 1000000),
    dt: Math.floor(Date.now() / 1000)
  };
}

function getMockForecastData(city: string) {
  const coords = getIndonesianCityCoordinates(city.toLowerCase()) || { lat: -6.2, lng: 106.8 }; // Default to Jakarta
  
  // Generate forecast entries for the next 5 days, with 3-hour intervals
  const forecastList = [];
  const now = Date.now();
  
  for (let i = 0; i < 40; i++) {
    // Each entry is 3 hours apart
    const entryTime = now + (i * 3 * 60 * 60 * 1000);
    const date = new Date(entryTime);
    
    // Base temperature with some daily variation (hotter during day)
    const hour = date.getHours();
    let baseTemp = 24 + Math.sin((hour - 6) * Math.PI / 12) * 4;
    
    // Add some random variation
    const temp = baseTemp + (Math.random() * 4 - 2);
    
    // Choose weather condition
    const conditions = [
      { main: "Clear", description: "clear sky", icon: "01d" },
      { main: "Clouds", description: "scattered clouds", icon: "03d" },
      { main: "Rain", description: "light rain", icon: "10d" },
      { main: "Rain", description: "moderate rain", icon: "10d" },
      { main: "Thunderstorm", description: "thunderstorm", icon: "11d" }
    ];
    const weatherCondition = conditions[Math.floor(Math.random() * conditions.length)];
    
    forecastList.push({
      dt: Math.floor(entryTime / 1000),
      main: {
        temp: temp,
        feels_like: temp - 1 + Math.random() * 2,
        temp_min: temp - 1,
        temp_max: temp + 1,
        pressure: 1008 + Math.floor(Math.random() * 10),
        humidity: 70 + Math.floor(Math.random() * 20)
      },
      weather: [weatherCondition],
      clouds: { all: Math.floor(Math.random() * 100) },
      wind: {
        speed: 1 + Math.random() * 5,
        deg: Math.floor(Math.random() * 360)
      },
      visibility: 8000 + Math.floor(Math.random() * 2000),
      pop: Math.random() * 0.5, // Probability of precipitation
      dt_txt: date.toISOString().replace('T', ' ').slice(0, 19)
    });
  }
  
  return {
    cod: "200",
    message: 0,
    cnt: forecastList.length,
    list: forecastList,
    city: {
      id: Math.floor(Math.random() * 1000000),
      name: city,
      coord: {
        lat: coords.lat,
        lon: coords.lng
      },
      country: "ID",
      population: 1000000,
      timezone: 25200,
      sunrise: Math.floor(Date.now() / 1000) - 21600,
      sunset: Math.floor(Date.now() / 1000) + 21600
    }
  };
}

function getMockAirQualityData() {
  // AQI values: 1 = Good, 2 = Fair, 3 = Moderate, 4 = Poor, 5 = Very Poor
  const aqi = Math.floor(Math.random() * 5) + 1;
  
  return {
    coord: { lon: 106.85, lat: -6.21 },
    list: [{
      main: { aqi: aqi },
      components: {
        co: 400 + Math.random() * 200,
        no: 0.4 + Math.random() * 0.3,
        no2: 1.5 + Math.random() * 1.0,
        o3: 30 + Math.random() * 20,
        so2: 1.2 + Math.random() * 0.8,
        pm2_5: 12 + Math.random() * 10,
        pm10: 25 + Math.random() * 15,
        nh3: 0.8 + Math.random() * 0.4
      },
      dt: Math.floor(Date.now() / 1000)
    }]
  };
}
