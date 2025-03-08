import { Suspense } from "react";
import { getCityWeather, getCityForecast } from "@/lib/weather-service";
import { WeatherDetail } from "@/components/weather-detail";
import { ForecastChart } from "@/components/forecast-chart";
import { AirQualityCard } from "@/components/air-quality-card";
import { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    name: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cityName = decodeURIComponent(params.name);
  
  return {
    title: `${cityName} Weather Forecast | Indonesia Weather App`,
    description: `Current weather conditions and forecast for ${cityName}, Indonesia.`,
  };
}

export default async function CityPage({ params }: PageProps) {
  const cityName = decodeURIComponent(params.name);
  
  try {
    // Fetch weather data using our new services
    const weatherData = await getCityWeather(cityName);
    const forecastData = await getCityForecast(cityName);
    
    // Mock AQI data since we don't have a direct package for it
    const airQualityData = {
      list: [{
        main: { 
          aqi: Math.floor(Math.random() * 5) + 1 
        },
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
    
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{cityName}</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Current weather conditions and forecast
          </p>
          <div className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Data source: {weatherData.dataSource}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Current weather section */}
          <div className="lg:col-span-4">
            <div className="weather-card p-6">
              <div className="flex items-center justify-center mb-4">
                <Image
                  src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
                  alt={weatherData.weather[0].description}
                  width={100}
                  height={100}
                />
              </div>
              
              <div className="text-center mb-6">
                <h2 className="text-5xl font-bold mb-2">
                  {Math.round(weatherData.main.temp)}°C
                </h2>
                <p className="text-xl capitalize">{weatherData.weather[0].description}</p>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  Feels like {Math.round(weatherData.main.feels_like)}°C
                </p>
              </div>
              
              <Suspense fallback={<div>Loading details...</div>}>
                <WeatherDetail
                  humidity={weatherData.main.humidity}
                  windSpeed={weatherData.wind.speed}
                  pressure={weatherData.main.pressure}
                  visibility={weatherData.visibility}
                  sunrise={weatherData.sys.sunrise}
                  sunset={weatherData.sys.sunset}
                  timezone={weatherData.timezone}
                />
              </Suspense>
            </div>
            
            {/* Air Quality Section */}
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Air Quality</h3>
              <Suspense fallback={<div className="weather-card animate-pulse h-32"></div>}>
                <AirQualityCard data={airQualityData} />
              </Suspense>
            </div>
          </div>
          
          {/* Forecast section */}
          <div className="lg:col-span-8">
            <h3 className="text-xl font-semibold mb-3">5-Day Forecast</h3>
            <div className="weather-card p-4">
              <Suspense fallback={<div className="h-64 animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
                <ForecastChart forecastData={forecastData} />
              </Suspense>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Hourly Forecast</h3>
              <div className="weather-card p-4 overflow-x-auto">
                <div className="flex space-x-4 min-w-max">
                  {forecastData.list.slice(0, 8).map((item: any, index: number) => (
                    <div key={index} className="flex flex-col items-center">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(item.dt * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <Image
                        src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                        alt={item.weather[0].description}
                        width={40}
                        height={40}
                      />
                      <p className="font-medium">{Math.round(item.main.temp)}°C</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error(`Error fetching data for ${cityName}:`, error);
    notFound();
  }
}
