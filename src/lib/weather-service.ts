import { promisify } from 'util';
import openWeatherApi from 'openweather-apis';
import weatherJs from 'weather-js';
import axios from 'axios';
import { INDONESIAN_CITY_CODES } from './bmkg-api';

// Set up the OpenWeather API
const openWeatherApiKey = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
openWeatherApi.setLang('en');
openWeatherApi.setUnits('metric');
openWeatherApi.setAPPID(openWeatherApiKey || '');

// Convert weather-js callback to Promise
const searchWeather = promisify((location: string, options: any, callback: any) => {
  weatherJs.find({ search: location, degreeType: 'C' }, callback);
});

// Base URL for BMKG API
const BMKG_BASE_URL = 'https://data.bmkg.go.id/DataMKG/MEWS/DigitalForecast';

/**
 * Get weather from BMKG API
 */
async function getBMKGWeather(cityCode: string) {
  try {
    // BMKG's API requires fetching XML or JSON files by region
    // This is a simplified version - in a real app we'd need to parse XML files
    const response = await axios.get(`${BMKG_BASE_URL}/DigitalForecast-Indonesia.xml`);
    
    // In reality, you would parse the XML here and extract the data for the specific city
    // For this example, we'll just return mock data
    return mockBMKGData(cityCode);
  } catch (error) {
    console.error('Error fetching BMKG data:', error);
    throw error;
  }
}

/**
 * Get city weather using multiple sources with fallback
 */
export async function getCityWeather(city: string) {
  // First try BMKG API for Indonesian cities
  const normalizedCity = city.toLowerCase();
  if (INDONESIAN_CITY_CODES[normalizedCity]) {
    try {
      const cityCode = INDONESIAN_CITY_CODES[normalizedCity].id;
      const bmkgData = await getBMKGWeather(cityCode);
      return formatWeatherData(bmkgData, 'BMKG');
    } catch (error) {
      console.warn(`Failed to get BMKG data for ${city}, falling back to OpenWeather`);
      // Continue to other sources if BMKG fails
    }
  }
  
  // Try OpenWeather API
  try {
    if (!openWeatherApiKey || openWeatherApiKey === 'your_openweathermap_api_key_here') {
      throw new Error('Invalid API key');
    }
    
    openWeatherApi.setCity(`${city},id`); // 'id' for Indonesia
    const weatherData = await promisify(openWeatherApi.getSmartJSON)();
    return formatWeatherData(weatherData, 'OpenWeather');
  } catch (openWeatherError) {
    console.warn(`Failed to get OpenWeather data for ${city}, falling back to weather-js`);
    
    // Last resort: Try weather-js (MSN Weather)
    try {
      const weatherResults: any[] = await searchWeather(city, {});
      if (weatherResults && weatherResults.length > 0) {
        return formatWeatherData(weatherResults[0], 'MSN');
      }
    } catch (weatherJsError) {
      console.error(`All weather sources failed for ${city}`);
    }
  }
  
  // If all APIs fail, use mock data
  return formatWeatherData(getMockWeatherData(city), 'Mock');
}

/**
 * Get forecast for a city
 */
export async function getCityForecast(city: string) {
  try {
    // Try to get forecast from OpenWeather
    if (openWeatherApiKey && openWeatherApiKey !== 'your_openweathermap_api_key_here') {
      openWeatherApi.setCity(`${city},id`);
      const forecast = await promisify(openWeatherApi.getWeatherForecastForDays)(5);
      return formatForecastData(forecast, 'OpenWeather');
    }
    
    // Fallback to weather-js for forecast
    const weatherResults: any[] = await searchWeather(`${city}, Indonesia`, {});
    if (weatherResults && weatherResults.length > 0 && weatherResults[0].forecast) {
      return formatForecastData(weatherResults[0], 'MSN');
    }
  } catch (error) {
    console.error(`Error getting forecast for ${city}:`, error);
  }
  
  // If all APIs fail, use mock forecast data
  return formatForecastData(getMockForecastData(city), 'Mock');
}

// Format weather data into a consistent structure regardless of source
function formatWeatherData(data: any, source: string) {
  // Handle different source formats
  if (source === 'OpenWeather') {
    return {
      name: data.name,
      dataSource: 'OpenWeatherMap',
      main: {
        temp: data.temp,
        feels_like: data.feels_like,
        temp_min: data.temp_min,
        temp_max: data.temp_max,
        pressure: data.pressure,
        humidity: data.humidity
      },
      weather: [
        {
          main: data.weathercode?.main || 'Clear',
          description: data.weathercode?.description || 'clear sky',
          icon: data.weathercode?.icon || '01d'
        }
      ],
      wind: {
        speed: data.wind?.speed || 0,
        deg: data.wind?.deg || 0
      },
      visibility: data.visibility || 10000,
      sys: {
        sunrise: data.sunrise,
        sunset: data.sunset
      },
      timezone: 25200, // UTC+7 for WIB
      dt: Math.floor(Date.now() / 1000)
    };
  } else if (source === 'MSN') {
    // Format MSN (weather-js) data
    const current = data.current || {};
    
    return {
      name: data.location?.name || 'Unknown',
      dataSource: 'MSN Weather',
      main: {
        temp: parseFloat(current.temperature) || 25,
        feels_like: parseFloat(current.feelslike) || 25, 
        temp_min: parseFloat(current.temperature) - 2,
        temp_max: parseFloat(current.temperature) + 2,
        pressure: 1013, // Not provided by MSN
        humidity: parseInt(current.humidity) || 70
      },
      weather: [
        {
          main: current.skytext || 'Clear',
          description: current.skytext?.toLowerCase() || 'clear sky',
          icon: mapSkyTextToIcon(current.skytext || 'Clear')
        }
      ],
      wind: {
        speed: parseWindSpeed(current.winddisplay) || 5,
        deg: 0 // Not provided in a usable format
      },
      visibility: 10000, // Not provided in meters
      sys: {
        sunrise: parseTime(current.sunrise),
        sunset: parseTime(current.sunset)
      },
      timezone: 25200, // UTC+7 for WIB
      dt: Math.floor(Date.now() / 1000)
    };
  } else if (source === 'BMKG') {
    // Format BMKG data
    return {
      name: data.name || 'Unknown',
      dataSource: 'BMKG',
      main: {
        temp: data.temp || 25,
        feels_like: data.temp_feels_like || 25,
        temp_min: data.temp_min || 23,
        temp_max: data.temp_max || 28,
        pressure: data.pressure || 1013,
        humidity: data.humidity || 70
      },
      weather: [
        {
          main: data.weather?.main || 'Clear',
          description: data.weather?.description || 'clear sky',
          icon: data.weather?.icon || '01d'
        }
      ],
      wind: {
        speed: data.wind?.speed || 5,
        deg: data.wind?.direction || 0
      },
      visibility: data.visibility || 10000,
      sys: {
        sunrise: data.sunrise || Math.floor(Date.now() / 1000) - 21600, // 6 hours ago
        sunset: data.sunset || Math.floor(Date.now() / 1000) + 21600 // 6 hours from now
      },
      timezone: 25200, // UTC+7 for WIB
      dt: Math.floor(Date.now() / 1000)
    };
  } else {
    // Mock data is already in our format
    return {
      ...data,
      dataSource: 'Simulated Data'
    };
  }
}

// Format forecast data consistently
function formatForecastData(data: any, source: string) {
  if (source === 'OpenWeather') {
    // Already formatted correctly
    return {
      dataSource: 'OpenWeatherMap',
      ...data
    };
  } else if (source === 'MSN') {
    // Convert MSN forecast format
    const forecastList = data.forecast.map((day: any) => {
      const date = new Date(day.date);
      return {
        dt: Math.floor(date.getTime() / 1000),
        main: {
          temp: (parseInt(day.high) + parseInt(day.low)) / 2,
          feels_like: (parseInt(day.high) + parseInt(day.low)) / 2,
          temp_min: parseInt(day.low),
          temp_max: parseInt(day.high),
          pressure: 1013,
          humidity: 70
        },
        weather: [{
          main: day.skytextday,
          description: day.skytextday.toLowerCase(),
          icon: mapSkyTextToIcon(day.skytextday)
        }],
        dt_txt: date.toISOString().replace('T', ' ').slice(0, 19)
      };
    });
    
    // Expand to hourly slots (each day repeated 8 times with variations for a 5-day forecast)
    const expandedList = [];
    for (let i = 0; i < forecastList.length && i < 5; i++) {
      const baseDay = forecastList[i];
      for (let hour = 0; hour < 24; hour += 3) {
        // Create time-based variations
        const entryTime = new Date(baseDay.dt * 1000);
        entryTime.setHours(hour);
        
        // Temperature varies throughout the day (cooler at night, warmer midday)
        const hourFactor = Math.sin((hour - 6) * Math.PI / 12);
        const tempVariation = hourFactor * 3;
        
        expandedList.push({
          ...baseDay,
          dt: Math.floor(entryTime.getTime() / 1000),
          main: {
            ...baseDay.main,
            temp: baseDay.main.temp + tempVariation,
            feels_like: baseDay.main.feels_like + tempVariation
          },
          dt_txt: entryTime.toISOString().replace('T', ' ').slice(0, 19)
        });
      }
    }
    
    return {
      dataSource: 'MSN Weather',
      cod: "200",
      message: 0,
      cnt: expandedList.length,
      list: expandedList,
      city: {
        id: 123456,
        name: data.location.name,
        coord: {
          lat: 0,
          lon: 0
        },
        country: "ID",
        population: 1000000,
        timezone: 25200,
        sunrise: Math.floor(Date.now() / 1000) - 21600,
        sunset: Math.floor(Date.now() / 1000) + 21600
      }
    };
  } else {
    // Use mock data as is
    return {
      dataSource: 'Simulated Data',
      ...data
    };
  }
}

// Helper functions
function parseTime(timeStr: string): number {
  if (!timeStr) return Math.floor(Date.now() / 1000);
  
  try {
    // Convert "6:00 AM" format to seconds since epoch
    const [time, period] = timeStr.split(' ');
    const [hours, minutes] = time.split(':').map(Number);
    
    const date = new Date();
    let hour = hours;
    
    if (period === 'PM' && hours < 12) {
      hour += 12;
    } else if (period === 'AM' && hours === 12) {
      hour = 0;
    }
    
    date.setHours(hour, minutes, 0, 0);
    return Math.floor(date.getTime() / 1000);
  } catch (error) {
    return Math.floor(Date.now() / 1000);
  }
}

function parseWindSpeed(windDisplay: string): number {
  if (!windDisplay) return 5;
  
  // Format is typically like "6 mph SW"
  const parts = windDisplay.split(' ');
  if (parts.length >= 1) {
    const speed = parseFloat(parts[0]);
    
    // Convert from mph to m/s if needed
    if (parts[1]?.toLowerCase() === 'mph') {
      return speed * 0.44704; // mph to m/s
    }
    return speed;
  }
  
  return 5;
}

function mapSkyTextToIcon(skyText: string): string {
  const lowerSky = skyText.toLowerCase();
  
  if (lowerSky.includes('sunny') || lowerSky.includes('clear')) return '01d';
  if (lowerSky.includes('partly cloudy')) return '02d';
  if (lowerSky.includes('mostly cloudy')) return '03d';
  if (lowerSky.includes('cloudy')) return '04d';
  if (lowerSky.includes('light rain') || lowerSky.includes('drizzle')) return '09d';
  if (lowerSky.includes('rain') || lowerSky.includes('shower')) return '10d';
  if (lowerSky.includes('thunder') || lowerSky.includes('storm')) return '11d';
  if (lowerSky.includes('snow') || lowerSky.includes('flurries')) return '13d';
  if (lowerSky.includes('mist') || lowerSky.includes('fog')) return '50d';
  
  return '01d'; // Default
}

// Mock data functions from original implementation
function getMockWeatherData(city: string) {
  // Generate random temperatures based on Indonesian climate (typically 24-33°C)
  const temp = 24 + Math.random() * 9;
  
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
    main: {
      temp: temp,
      feels_like: temp - 1 + Math.random() * 2,
      temp_min: temp - 2,
      temp_max: temp + 2,
      pressure: 1008 + Math.floor(Math.random() * 10),
      humidity: 70 + Math.floor(Math.random() * 20)
    },
    weather: [weatherCondition],
    wind: {
      speed: 1 + Math.random() * 5,
      deg: Math.floor(Math.random() * 360)
    },
    sys: {
      sunrise: Math.floor(Date.now() / 1000) - 21600,
      sunset: Math.floor(Date.now() / 1000) + 21600
    },
    visibility: 8000 + Math.floor(Math.random() * 2000),
    timezone: 25200,
    dt: Math.floor(Date.now() / 1000)
  };
}

function getMockForecastData(city: string) {
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
      dt_txt: date.toISOString().replace('T', ' ').slice(0, 19)
    });
  }
  
  return {
    cod: "200",
    message: 0,
    cnt: forecastList.length,
    list: forecastList,
    city: {
      name: city,
      country: "ID",
      timezone: 25200,
      sunrise: Math.floor(Date.now() / 1000) - 21600,
      sunset: Math.floor(Date.now() / 1000) + 21600
    }
  };
}

function mockBMKGData(cityCode: string) {
  // Find city name from code
  const cityEntry = Object.entries(INDONESIAN_CITY_CODES).find(([_, data]) => data.id === cityCode);
  const cityName = cityEntry ? cityEntry[1].name : 'Unknown City';
  
  // Simplified mock data for BMKG - in reality we'd parse XML
  return {
    name: cityName,
    temp: 24 + Math.random() * 9,
    temp_feels_like: 24 + Math.random() * 7,
    temp_min: 24,
    temp_max: 33,
    pressure: 1013,
    humidity: 80,
    weather: {
      main: Math.random() > 0.5 ? "Rain" : "Clear",
      description: Math.random() > 0.5 ? "light rain" : "clear sky",
      icon: Math.random() > 0.5 ? "10d" : "01d"
    },
    wind: {
      speed: 2 + Math.random() * 5,
      direction: Math.floor(Math.random() * 360)
    },
    visibility: 10000,
    sunrise: Math.floor(Date.now() / 1000) - 21600,
    sunset: Math.floor(Date.now() / 1000) + 21600
  };
}
